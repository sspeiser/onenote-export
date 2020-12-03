// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


// <graphInitSnippet>
// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};



// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
// </graphInitSnippet>

// <getUserSnippet>
async function getUser() {
    return await graphClient
        .api('/me')
        // Only get the fields used by the app
        .select('id,displayName,mail,userPrincipalName')
        .get();
}
// </getUserSnippet>

async function getPage(contentUrl) {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    try {
        let response = await graphClient
            .api(contentUrl)
            //.api('/me/onenote/pages/' + id + '/$value')
            .get();
        //console.log('/me/onenote/pages/' + id + '/content');
        console.log(contentUrl);
        console.log(response);
        updatePage(Views.page, response);
    } catch (error) {
        updatePage(Views.error, {
            message: 'Error getting page',
            debug: error
        });
    }
}

async function getPages(url) {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    try {
        let response = await graphClient
            .api(url)
            .get();
        updatePage(Views.pages, response.value);
    } catch (error) {
        updatePage(Views.error, {
            message: 'Error getting pages',
            debug: error
        });
    }
}

async function savePages(notebook, sectiongroup, section, url) {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    const { Reader, Writer } = window.conflux;
    // const writer = writable.getWriter();

    let paths = {};

    try {
        let response = await graphClient
            .api(url)
            .get();

        // More Pages?

        const { readable, writable } = new Writer();
        const writer = writable.getWriter();

        // Set up streamsaver
        const fileStream = streamSaver.createWriteStream("conflux.zip");
        readable.pipeTo(fileStream);

        // Add a file
        writer.write({
            name: "/cat.txt",
            stream: () => new Response("Test\n").body // response.value[0].content
        });

        const path = "/" + notebook + "/" + sectiongroup + "/" + section;


        writer.write({
            name: path,
            directory: true
        })

        for (const page of response.value) {
            let pageContent = await graphClient.api(page.contentUrl).get();

            console.log(pageContent);

            let images = pageContent.getElementsByTagName('img');

            for (const image of images) {
                let imgStream = await graphClient.api(image.getAttribute('data-fullres-src')).getStream();

                const id = image.getAttribute('data-fullres-src').split(/\//).slice(0, -1).pop();
                const extension = image.getAttribute('data-fullres-src-type').split(/\//).pop();
                const relResourcePath = "resources" + '/' + id + '.' + extension;

                image.setAttribute('src', relResourcePath);

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
                const relResourcePath = "resources" + '/' + id + '.' + extension;
                o.setAttribute('data', relResourcePath);

                console.log('Resourcepath: ' + relResourcePath);

                if(paths[relResourcePath]) {
                    console.log('Resource already present');
                    continue;
                } 
                paths[relResourcePath] = true;

                let objStream = await graphClient.api(objUrl).getStream();
                if (!objStream) continue;

                
                writer.write({
                    name: path + '/' + relResourcePath,
                    stream: () => objStream
                });
            }


            writer.write({
                name: "/" + notebook + "/" + sectiongroup + "/" + section + '/' + page.title.replace(/\//,' ') + '.html',
                stream: () => new Response(pageContent.documentElement.outerHTML).body
            });
        }



        writer.close();

    } catch (error) {
        updatePage(Views.error, {
            message: 'Error getting pages',
            debug: error
        });
    }
}


async function getSections() {
    const user = JSON.parse(sessionStorage.getItem('graphUser'));


    try {
        // GET /me/calendarview?startDateTime=''&endDateTime=''
        // &$select=subject,organizer,start,end
        // &$orderby=start/dateTime
        // &$top=50
        let response = await graphClient
            .api('/me/onenote/notebooks/')
            .expand('sections,sectionGroups($expand=sections)')
            // Select just the fields we are interested in
            //.select('id,displayName,pagesURL,parentNotebook')
            //.top(50)
            .get();

        var sections = [];
        for (const notebook of response.value) {
            for (const section of notebook.sections) {
                section['notebookName'] = notebook.displayName;
                section['sectionGroupName'] = '.';
                sections.push(section);
            }
            for (const sectionGroup of notebook.sectionGroups) {
                for (const section of sectionGroup.sections) {
                    section['notebookName'] = notebook.displayName;
                    section['sectionGroupName'] = sectionGroup.displayName;
                    sections.push(section);
                }
            }
        }
        updatePage(Views.notes, sections);
    } catch (error) {
        updatePage(Views.error, {
            message: 'Error getting notes',
            debug: error
        });
    }
}
// </getEventsSnippet>


