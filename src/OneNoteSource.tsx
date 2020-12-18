import { Writer } from '@transcend-io/conflux';
import { Note, Resource, createResource, createNote, EnexDumper, EnexDumperOptions } from 'enex-dumper';
import { StringWriter } from 'enex-dumper/dist/src/EnexDumper';
import { Stream } from 'stream';
import streamSaver from 'streamsaver';
import * as ponyfill from 'web-streams-polyfill/ponyfill';
import { getAuthenticatedClient } from './GraphService';
import { TreePage } from "./PageTree";
import { SaveConfig } from './SaveConfig';
import { createReadableStreamWrapper } from '@mattiasbuelens/web-streams-adapter';
const toPolyfillReadable = createReadableStreamWrapper(ponyfill.ReadableStream);


class StreamWriter implements StringWriter {
    readonly result: Promise<void>;
    private resolve?: () => void;

    private encoder: TextEncoder;


    constructor(private writer: WritableStreamDefaultWriter<any>) {
        this.result = new Promise<void>((r) => this.resolve = r);
        this.encoder = new TextEncoder();
    }

    public write(str: string): Promise<void> {
        return this.writer.ready.then(() => this.writer.write(this.encoder.encode(str)));
    }

    public close(): Promise<void> {
        return new Promise<void>((r) => {
            this.writer.ready.then(() => {
                this.writer.close().then(() => {
                    if (this.resolve) {
                        this.resolve();
                    }
                    r();
                })
            })
        });
    }
}

export async function savePagesEnex(accessToken: string, pages: TreePage[], saveConfig: SaveConfig) {
    if (!saveConfig.enex) {
        return;
    }

    // Set up streamsaver
    streamSaver.WritableStream = ponyfill.WritableStream

    const fileStream = streamSaver.createWriteStream("onenote-export.enex");
    let fileStreamWriter: WritableStreamDefaultWriter<any> = fileStream.getWriter();
    let writer = new StreamWriter(fileStreamWriter);

    const options = new EnexDumperOptions();
    const dumper = new EnexDumper(writer, options);

    let pagePromises: Promise<any>[] = [];

    for (const page of pages) {
        pagePromises.push(noteFromOneNote(accessToken, page, saveConfig).then(dumper.next.bind(dumper)));
    }
    await Promise.all(pagePromises);
    dumper.complete();
    await dumper.done;
    await writer.result;
}


async function noteFromOneNote(accessToken: string, page: TreePage, saveConfig: SaveConfig): Promise<Note> {
    const client = getAuthenticatedClient(accessToken);
    if (!page.contentURL) return createNote({ title: page.label });
    const document = await client.api(page.contentURL).get();

    const resources: Resource[] = [];

    const images: HTMLImageElement[] = [];
    for (const image of document.getElementsByTagName('img')) {
        images.push(image);
    }
    for (const image of images) {
        let src = image.getAttribute('data-fullres-src') || image.getAttribute('src');
        if (!src) continue;
        let type = image.getAttribute('data-fullres-src-type') || image.getAttribute('data-src-type') || '';

        const id = src.split(/\//).slice(0, -1).pop();
        const extension = type.split(/\//).pop();

        const propsResource = {
            url: src,
            filename: image.src.split('/').pop() + '.' + extension,
            mimetype: type,
            width: image.width || undefined,
            height: image.height || undefined,
        }

        const resource = createResource(propsResource);
        await loadResource(accessToken)(resource);
        resources.push(resource);
    }

    const objects: HTMLObjectElement[] = [];
    const objectCollection = document.getElementsByTagName('object');
    for (let i = 0; i < objectCollection.length; i++) {
        const object = objectCollection.item(i);
        if (object)
            objects.push(object);
    }
    for (const object of objects) {
        if (!object.hasAttribute('data')) continue;
        if (!object.hasAttribute('type')) continue;
        const extension = object.type.split(/\//).pop();
        const propsResource = {
            url: object.data,
            filename: object.data.split('/').pop() + '.' + extension,
            mimetype: object.type,
        }
        // resources.push(createResource(propsResource, loadResource(accessToken)));
        const resource = createResource(propsResource);
        await loadResource(accessToken)(resource);
        resources.push(resource);
    }

    const propsNote = {
        title: page.label || 'No title',
        tags: [(page.notebook + "." + (page.sectionGroup === "." ? "" : page.sectionGroup + ".") + page.section)],
        author: null,
        content: document,
        resources: resources,
        created: null,
        updated: null,
    }
    return createNote(propsNote);
}
function loadResource(accessToken: string) {
    const client = getAuthenticatedClient(accessToken);
    return async function (resource: Resource) {
        if (!resource.url) return new Response("").body;
        const stream = await client.api(resource.url).getStream();
        try {
            const polystream = toPolyfillReadable(stream);
            if (polystream instanceof ponyfill.ReadableStream) {
                resource.dataStream = polystream;
            } else {
                resource.dataStream = stream;
            }
        } catch (error) {
            console.log(error);
        }
    }
}
