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

    try {
        let response = await graphClient
            .api(url)
            .get();

        // More Pages?

        const { readable, writable } = new Writer();
        const writer = writable.getWriter();

        // Set up streamsaver
        const fileStream = streamSaver.createWriteStream("conflux.zip");

        // Add a file
        writer.write({
            name: "/cat.txt",
            stream: () => new Response("Test\n").body // response.value[0].content
        });
        writer.write({
            name: "/" + notebook + "/" + sectiongroup + "/" + section,
            directory: true
        })

        for (const page of response.value) {
            let pageContentResponse = await graphClient.api(page.contentUrl).getStream();

            const htmlAnalyzeStream = new stream.PassThrough();
            const htmlWriteStream = new stream.PassThrough();
            pageContentResponse.pipe(htmlAnalyzeStream);
            pageContentResponse.pipe(htmlWriteStream);

            writer.write({
                name: "/" + notebook + "/" + sectiongroup + "/" + section + '/' + page.title + '.html',
                stream: () => htmlWriteStream
            })

            htmlAnalyzeStream.on('data', function (chunk) {
                console.log("Chunk: " + chunk);
              });
        }

        readable.pipeTo(fileStream);

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


