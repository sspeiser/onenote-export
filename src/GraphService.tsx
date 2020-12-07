import { OnenotePage } from 'microsoft-graph';
import { PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';


import { Writer } from '@transcend-io/conflux';
import streamSaver from "streamsaver";
import * as ponyfill from 'web-streams-polyfill/ponyfill';

import TurndownService from 'turndown';



var graph = require('@microsoft/microsoft-graph-client');

export type PageTree = TreeInternalNode[];

export class TreeNode {
    static undefinedId: number = 0;
    static undefinedLabel: number = 0;
    label: string;
    id: any;

    constructor(label: string | undefined | null, id: any) {
        if (label == null) {
            this.label = "undefinedLabel" + TreeNode.undefinedLabel++;
        } else {
            this.label = label;
        }
        if (id == null) {
            this.id = "undefinedId" + TreeNode.undefinedId++;
        } else {
            this.id = id;
        }
    }
}

export class TreeInternalNode extends TreeNode {
    children: TreeNode[] = [];
}

export class TreePage extends TreeNode {
    contentURL: string | undefined | null;
    notebook: string;
    sectionGroup: string;
    section: string;

    constructor(label: string | undefined | null, id: string | undefined | null, contentURL: string | undefined | null, notebook: string, sectionGroup: string, section: string) {
        super(label, id);
        this.contentURL = contentURL;
        this.notebook = notebook;
        this.sectionGroup = sectionGroup;
        this.section = section;
    }
}


async function getPages(accessToken: string, pagesURL: string): Promise<OnenotePage[]> {
    const client = getAuthenticatedClient(accessToken);
    var response: PageCollection = await client
        .api(pagesURL)
        .get();
    if (response["@odata.nextLink"]) {
        // Presence of the nextLink property indicates more results are available
        // Use a page iterator to get all results
        var pages: OnenotePage[] = [];

        var pageIterator = new PageIterator(client, response, (page) => {
            pages.push(page);
            return true;
        });

        await pageIterator.iterate();

        return pages;
    } else {

        return response.value;
    }
}

export async function getPageTree(accessToken: string): Promise<PageTree> {
    const client = getAuthenticatedClient(accessToken);

    let response = await client
        .api('/me/onenote/notebooks/')
        .expand('sections,sectionGroups($expand=sections)')
        .get();

    let pageTree: PageTree = [];

    for (const notebook of response.value) {
        let notebookNode = new TreeInternalNode(notebook.displayName, notebook.id);
        pageTree.push(notebookNode);
        for (const section of notebook.sections) {
            let sectionNode = new TreeInternalNode(section.displayName, section.id);
            notebookNode.children.push(sectionNode);

            for (const page of await getPages(accessToken, section.pagesUrl)) {
                sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, '.', section.displayName));
            }
        }
        for (const sectionGroup of notebook.sectionGroups) {
            let sectionGroupNode = new TreeInternalNode(sectionGroup.displayName, sectionGroup.id);
            notebookNode.children.push(sectionGroupNode);
            for (const section of sectionGroup.sections) {
                let sectionNode = new TreeInternalNode(section.displayName, section.id);
                sectionGroupNode.children.push(sectionNode);

                for (const page of await getPages(accessToken, section.pagesUrl)) {
                    sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, sectionGroup.displayName, section.displayName));
                }
            }
        }
    }
    return pageTree;
}


function getAuthenticatedClient(accessToken: string) {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done: any) => {
            done(null, accessToken);
        }
    });

    return client;
}

export async function getUserDetails(accessToken: string) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
        .api('/me')
        .select('displayName,mail,userPrincipalName')
        .get();

    return user;
}


export async function savePages(accessToken: string, pages: TreePage[]) {
    const client = getAuthenticatedClient(accessToken);

    var turndownService = new TurndownService()

    let paths: {[key: string]: boolean} = {};

    const { readable, writable } = new Writer();
    const writer = writable.getWriter();

    // Set up streamsaver
    streamSaver.WritableStream = ponyfill.WritableStream
    const fileStream = streamSaver.createWriteStream("onenote-export.zip");
    readable.pipeTo(fileStream);

    
    for (const page of pages) {
        let pageContent = await client.api(page.contentURL).get();

        let images = pageContent.getElementsByTagName('img');

        const path = "/" + page.notebook + "/" + page.sectionGroup + "/" + page.section;
        

        for (const image of images) {
            let src = image.getAttribute('data-fullres-src') || image.getAttribute('src');
            if(!src) continue;
            let imgStream = await client.api(src).getStream();

            const id = src.split(/\//).slice(0, -1).pop();
            const extension = src.split(/\//).pop();
            const relResourcePath = "resources/" + id + '.' + extension;

            image.setAttribute('src', relResourcePath);


            if (paths[relResourcePath]) {
                console.log('Resource already present');
                continue;
            }
            paths[relResourcePath] = true;

            writer.write({
                name: path + '/' + relResourcePath,
                stream: () => imgStream
            });
        }

        let objectTags = pageContent.getElementsByTagName('object');
        for (const o of objectTags) {
            if (!o.hasAttribute('data')) continue;
            if (!o.hasAttribute('type')) continue;
            const objUrl = o.getAttribute('data');
            const id = objUrl.split(/\//).slice(0, -1).pop();
            const extension = o.getAttribute('type').split(/\//).pop();
            const relResourcePath = "resources/" + id + '.' + extension;
            o.setAttribute('data', relResourcePath);

            console.log('Resourcepath: ' + relResourcePath);

            if (paths[relResourcePath]) {
                console.log('Resource already present');
                continue;
            }
            paths[relResourcePath] = true;

            let objStream = await client.api(objUrl).getStream();
            if (!objStream) continue;


            writer.write({
                name: path + '/' + relResourcePath,
                stream: () => objStream
            });
        }

        let pagePath = path + '/' + page.label.replace(/\//, ' ') + '.html';
        let i = 0;
        while(paths[pagePath]) {
            pagePath = path + '/' + page.label.replace(/\//, ' ') + '_' + i + '.html';
            i++;
        }
        paths[pagePath] = true;

        console.log('Writing ' + pagePath);
        writer.write({
            name: pagePath,
            stream: () => new Response(pageContent.documentElement.outerHTML).body
        });
        console.log('Done ' + pagePath);
        let mdPath = pagePath.replace(/\.html$/, '.md');
        console.log('Writing ' + mdPath);
        let markdown = turndownService.turndown(pageContent.documentElement.outerHTML);
        if(markdown) {
            writer.write({
                name: mdPath,
                stream: () => new Response(markdown).body
            });
        }
        console.log('Done ' + mdPath);
    }
    writer.close();
}