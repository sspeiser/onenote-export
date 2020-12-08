import { OnenotePage } from 'microsoft-graph';
import { PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';

import { Writable } from 'stream';

import { Writer } from '@transcend-io/conflux';
import streamSaver from "streamsaver";
import * as ponyfill from 'web-streams-polyfill/ponyfill';

import TurndownService from 'turndown';

import SparkMD5 from 'spark-md5';



var graph = require('@microsoft/microsoft-graph-client');

export interface SaveConfig {
    markdown: boolean,
    html: boolean,
    resources: boolean,
    images: boolean,
    enex: boolean
}

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

class MD5Stream extends Writable {
    spark: SparkMD5;

    constructor() {
        super({write: this._write}, new CountQueuingStrategy({ highWaterMark: 1 });
        this.spark = new SparkMD5();
//        var hexHash = spark.end();                      // hex hash
      }

    _write(chunk, enc, next) {
        this.spark.append(chunk);
        next();
    }
}



async function savePageEnex(accessToken: string, page: TreePage, pageContent: any, paths: { [key: string]: boolean }, writer: WritableStreamDefaultWriter, saveConfig: SaveConfig): Promise<any> {
    writer.write(`${`<note><title>${page.label}</title>`}<content><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>`);
    writer.write('<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">');
    if(saveConfig.images) {
        let images = pageContent.getElementsByTagName('img');

        for (const image of images) {
            let src = image.getAttribute('data-fullres-src') || image.getAttribute('src');
            if (!src) continue;
            let type = image.getAttribute('data-fullres-src-type') || image.getAttribute('data-src-type');

            const client = getAuthenticatedClient(accessToken);
            const id = src.split(/\//).slice(0, -1).pop();
            const extension = type.split(/\//).pop();
            const fileName = id + '.' + extension;


            var spark = new SparkMD5();
            let md5stream = new Writable();
            md5stream._write = function (chunk, encoding, done) {
              spark.append(chunk);
              done();
            };

            client.api(src).getStream((error, resourceStream) => {
                resourceStream.pipe(md5stream).pipe(base64stream).on('error', console.log);
            });
            
            md5stream.on('close', () => md5stream.end());
    // writer.write({
    //     name: path + '/' + relResourcePath,
    //     stream: () => resourceStream
    // });

    // return relResourcePath;


            // imgObjPromises.push(saveResource(accessToken, src, type, path, paths, writer).then((relResourcePath) => image.setAttribute('src', relResourcePath)));
            // imgObjPromises.push(saveResource(accessToken, src, type, '', paths, writer).then((relResourcePath) => image.setAttribute('src', relResourcePath)));
        }
    }



    writer.write('<en-note');
    for(const attribute of ['bgcolor', 'text', 'style', 'title', 'lang', 'xml:lang', 'dir']) {
        if(pageContent.body.hasAttribute(attribute)) {
            writer.write(` ${attribute}="${pageContent.body.getAttribute(attribute)}"`)
        }
    }  
    writer.write('>');

    pageContent.body
    if (saveConfig.html) {
        writer.write({
            name: '/html' + pagePath,
            stream: () => new Response(pageContent.documentElement.outerHTML).body
        });
    }
    
    Hello, World.
            <div>
                    <br />
                </div>
                <div>
                    <en-media alt="" type="image/jpeg" hash="dd7b6d285d09ec054e8cd6a3814ce093" />
                </div>
                <div>
                    <br />
                </div>
        </en-note>
        ]]>
    </content>
        <created>20130730T205204Z</created>
        <updated>20130730T205624Z</updated>
        <tag>fake-tag</tag>
        <note-attributes>
            <latitude>33.88394692352314</latitude>
            <longitude>-117.9191355110099</longitude>
            <altitude>96</altitude>
            <author>Brett Kelly</author>
        </note-attributes>
        <resource>
            <data encoding="base64">/9j/4AAQSkZJRgABAQAAAQABAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZ
            WiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQ
        <!-- ... -->
        kfeIGT/+uufk8DpM0gyVjGfmzkgetesnUoTHJ+5Cxn86zmv4/wB75EW+QHAPUH/P9Ky+s1rtrr/wfvOm
        dBSamnq/xPKp/hpLKmS7x4OBjgn6elee6v4OuLJirRSHb/FtyG9s9u1fR0+oTiIRvGq7W4bpisfUGk1C
        GVWtkIyM57n1rfDY+uqigtU76ffZkUsA6iajHZ6v/P8A4B//2Q==</data>
            <mime>image/jpeg</mime>
            <width>1280</width>
            <height>720</height>
            <resource-attributes>
                <file-name>snapshot-DAE9FC15-88E3-46CF-B744-DA9B1B56EB57.jpg</file-name>
            </resource-attributes>
        </resource>
</note >
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

    if (saveConfig.enex) {
        return savePageEnex(accessToken, page, pageContent, paths, writer, saveConfig);
    }

    let imgObjPromises: Promise<any>[] = [];
    const path = "/" + page.notebook + "/" + page.sectionGroup + "/" + page.section;

    if (saveConfig.images) {
        let images = pageContent.getElementsByTagName('img');

        for (const image of images) {
            let src = image.getAttribute('data-fullres-src') || image.getAttribute('src');
            if (!src) continue;
            let type = image.getAttribute('data-fullres-src-type') || image.getAttribute('data-src-type');
            // imgObjPromises.push(saveResource(accessToken, src, type, path, paths, writer).then((relResourcePath) => image.setAttribute('src', relResourcePath)));
            imgObjPromises.push(saveResource(accessToken, src, type, '', paths, writer).then((relResourcePath) => image.setAttribute('src', relResourcePath)));
        }
    }

    if (saveConfig.resources) {
        let objectTags = pageContent.getElementsByTagName('object');
        for (const o of objectTags) {
            if (!o.hasAttribute('data')) continue;
            if (!o.hasAttribute('type')) continue;

            const objUrl = o.getAttribute('data');
            // imgObjPromises.push(saveResource(accessToken, objUrl, o.getAttribute('type'), path, paths, writer).then((relResourcePath) => o.setAttribute('data', relResourcePath)));
            imgObjPromises.push(saveResource(accessToken, objUrl, o.getAttribute('type'), '', paths, writer).then((relResourcePath) => o.setAttribute('data', relResourcePath)));
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

    if (saveConfig.html) {
        writer.write({
            name: '/html' + pagePath,
            stream: () => new Response(pageContent.documentElement.outerHTML).body
        });
    }
    if (saveConfig.markdown) {
        let mdPath = pagePath.replace(/\.html$/, '.md');
        var turndownService = new TurndownService();
        let markdown = turndownService.turndown(pageContent.documentElement.outerHTML);
        if (markdown) {
            writer.write({
                name: '/markdown' + mdPath,
                stream: () => new Response(markdown).body
            });
        }
    }

    return true;
}

export async function savePages(accessToken: string, pages: TreePage[], saveConfig: SaveConfig) {
    const client = getAuthenticatedClient(accessToken);


    // Set up streamsaver
    streamSaver.WritableStream = ponyfill.WritableStream

    let writer: WritableStreamDefaultWriter<any>;

    if (!saveConfig.enex) {
        const { readable, writable } = new Writer();
        writer = writable.getWriter();

        const fileStream = streamSaver.createWriteStream("onenote-export.zip");

        readable.pipeTo(fileStream);
    } else {
        const fileStream = streamSaver.createWriteStream("onenote-export.enex");
        writer = fileStream.getWriter();
    }

    let pagePromises: Promise<any>[] = [];
    let paths: { [key: string]: boolean } = {};

    for (const page of pages) {
        pagePromises.push(client.api(page.contentURL).get().then((pageContent: any) => savePage(accessToken, page, pageContent, paths, writer, saveConfig)));
    }
    await Promise.all(pagePromises);
    writer.close();
}