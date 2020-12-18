import { OnenotePage } from 'microsoft-graph';
import { GraphRequest, PageCollection, PageIterator, Client, RetryHandlerOptions, ShouldRetry } from '@microsoft/microsoft-graph-client';

import { Writer } from '@transcend-io/conflux';
import streamSaver from "streamsaver";
import * as ponyfill from 'web-streams-polyfill/ponyfill';

// import TurndownService from 'turndown';
import Converter from 'showdown';

import { PageTree, TreeInternalNode, TreePage } from './PageTree';
import { SaveConfig } from './SaveConfig';


async function wrapAPI(graphRequest: GraphRequest): Promise<any> {
    return new Promise((resolve, reject) => {
        graphRequest.get((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
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

    // let response = await client
    //     .api('/me/onenote/notebooks/')
    //     .expand('sections,sectionGroups($expand=sections)')
    //     .get()


    let response = await wrapAPI(client
        .api('/me/onenote/notebooks/')
        // .middlewareOptions([new RetryHandlerOptions(undefined, undefined, () => false)])
        .expand('sections,sectionGroups($expand=sections)'))
        //     .get()
        .catch(console.log);

    let pageTree: PageTree = [];
    let pagePromises: Promise<any>[] = [];

    for (const notebook of response.value) {
        let notebookNode = new TreeInternalNode(notebook.displayName, notebook.id);
        pageTree.push(notebookNode);
        for (const section of notebook.sections) {
            let sectionNode = new TreeInternalNode(section.displayName, section.id);
            notebookNode.children.push(sectionNode);
            pagePromises.push(
                getPages(accessToken, section.pagesUrl).then((pages) => {
                    for (const page of pages) {
                        sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, '.', section.displayName));
                    }
                }));
            // for (const page of await getPages(accessToken, section.pagesUrl)) {
            //     sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, '.', section.displayName));
            // }
        }
        for (const sectionGroup of notebook.sectionGroups) {
            let sectionGroupNode = new TreeInternalNode(sectionGroup.displayName, sectionGroup.id);
            notebookNode.children.push(sectionGroupNode);
            for (const section of sectionGroup.sections) {
                let sectionNode = new TreeInternalNode(section.displayName, section.id);
                sectionGroupNode.children.push(sectionNode);
                pagePromises.push(
                    getPages(accessToken, section.pagesUrl).then((pages) => {
                        for (const page of pages) {
                            sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, sectionGroup.displayName, section.displayName));
                        }
                    }));
                // for (const page of await getPages(accessToken, section.pagesUrl)) {
                //     sectionNode.children.push(new TreePage(page.title, page.id, page.contentUrl, notebook.displayName, sectionGroup.displayName, section.displayName));
                // }
            }
        }
    }
    await Promise.all(pagePromises);
    return pageTree;
}


export function getAuthenticatedClient(accessToken: string) {
    // Initialize Graph client
    const client = Client.init({
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

async function saveResource(accessToken: string, src: string, type: string, path: string, paths: { [key: string]: boolean; }, writer: WritableStreamDefaultWriter): Promise<string> {
    const client = getAuthenticatedClient(accessToken);
    const id = src.split(/\//).slice(0, -1).pop();
    const extension = type.split(/\//).pop();
    const relResourcePath = "resources/" + id + '.' + extension;

    if (paths[relResourcePath]) {
        console.log('Resource already present');
        return relResourcePath;
    }
    paths[relResourcePath] = true;

    let resourceStream = await client.api(src).getStream();
    if (!resourceStream)
        return relResourcePath;

    writer.write({
        name: path + '/' + relResourcePath,
        stream: () => resourceStream
    });

    return relResourcePath;
}

async function savePage(accessToken: string, page: TreePage, pageContent: any, paths: { [key: string]: boolean }, writer: WritableStreamDefaultWriter, saveConfig: SaveConfig): Promise<any> {
    let imgObjPromises: Promise<any>[] = [];
    const path = "/" + page.notebook + "/" + page.sectionGroup + "/" + page.section;
    const anotherPathElementForMDorHTML = 0;
    const resourcePathPrefix = '../'.repeat(path.split('/').map((directory) => {
        if (directory === '.') return 0;
        if (directory === '') return 0;
        if (directory === '..') return -1;
        return 1;
    }).reduce((x: number, y: number) => x + y, anotherPathElementForMDorHTML));

    if (saveConfig.images) {
        let images = pageContent.getElementsByTagName('img');

        for (const image of images) {
            let src = image.getAttribute('data-fullres-src') || image.getAttribute('src');
            if (!src) continue;
            let type = image.getAttribute('data-fullres-src-type') || image.getAttribute('data-src-type');
            // imgObjPromises.push(saveResource(accessToken, src, type, path, paths, writer).then((relResourcePath) => image.setAttribute('src', relResourcePath)));
            imgObjPromises.push(saveResource(accessToken, src, type, '', paths, writer).then((relResourcePath) => image.setAttribute('src', resourcePathPrefix + relResourcePath)));
        }
    }

    if (saveConfig.resources) {
        let objectTags = pageContent.getElementsByTagName('object');
        for (const o of objectTags) {
            if (!o.hasAttribute('data')) continue;
            if (!o.hasAttribute('type')) continue;

            const objUrl = o.getAttribute('data');
            // imgObjPromises.push(saveResource(accessToken, objUrl, o.getAttribute('type'), path, paths, writer).then((relResourcePath) => o.setAttribute('data', relResourcePath)));
            imgObjPromises.push(saveResource(accessToken, objUrl, o.getAttribute('type'), '', paths, writer).then((relResourcePath) => o.setAttribute('data', resourcePathPrefix + relResourcePath)));
        }
    }

    let pagePath = path + '/' + page.label.replace(/\//, ' ') + '.html';
    let i = 0;
    while (paths[pagePath]) {
        pagePath = path + '/' + page.label.replace(/\//, ' ') + '_' + i + '.html';
        i++;
    }
    paths[pagePath] = true;

    // Important to wait for all images and objects before writing html, otherwise src and data attributes have not been updated
    await Promise.all(imgObjPromises);

    // if (saveConfig.html) {
    //     writer.write({
    //         name: /* '/html'  + */ pagePath,
    //         stream: () => new Response(pageContent.documentElement.outerHTML).body
    //     });
    // }

    // Remove all styles
    // for(const element of pageContent.getElementsByTagName('*')) {
    //     element.removeAttribute('style');
    // }
    if (saveConfig.html) {
        writer.write({
            name: /* '/html'  + */ pagePath, //.replace('.html', '_nostyles.html'),
            stream: () => new Response(pageContent.documentElement.outerHTML).body
        });
    }


    if (saveConfig.markdown) {
        try {
            let mdPath = pagePath.replace(/\.html$/, '.md');
            let converter = new Converter.Converter();
            let markdown = "";
            if (pageContent && pageContent.body) {
                markdown = converter.makeMarkdown(pageContent.body.innerHTML, pageContent);
                // var turndownService = new TurndownService();
                // let markdown = turndownService.turndown(pageContent.documentElement.outerHTML);
            } else {
                console.log(pageContent);
            }
            if (markdown) {
                writer.write({
                    name: /* '/markdown' + */ mdPath,
                    stream: () => new Response(markdown).body
                });
            }
        } catch (error) {
            console.log(error);
            return true;
        }
    }

    return true;
}

export async function savePages(accessToken: string, pages: TreePage[], saveConfig: SaveConfig) {
    const client = getAuthenticatedClient(accessToken);

    // Set up streamsaver
    streamSaver.WritableStream = ponyfill.WritableStream

    let writer: WritableStreamDefaultWriter<any>;

    const { readable, writable } = new Writer();
    writer = writable.getWriter();

    const fileStream = streamSaver.createWriteStream("onenote-export.zip");

    readable.pipeTo(fileStream);

    let pagePromises: Promise<any>[] = [];
    let paths: { [key: string]: boolean } = {};

    for (const page of pages) {
        if (!page.contentURL) continue;
        pagePromises.push(client.api(page.contentURL).get().then((pageContent: any) =>
            savePage(accessToken, page, pageContent, paths, writer, saveConfig)).then()
        );
    }
    await Promise.all(pagePromises);
    writer.close();
}