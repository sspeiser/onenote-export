// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Select DOM elements to work with
const authenticatedNav = document.getElementById('authenticated-nav');
const accountNav = document.getElementById('account-nav');
const mainContainer = document.getElementById('main-container');

const Views = { error: 1, home: 2, notes: 3, pages: 4, page: 5 };

function createElement(type, className, text) {
    let element = document.createElement(type);
    element.className = className;

    if (text) {
        let textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }

    return element;
}

function showAuthenticatedNav(user, view) {
    authenticatedNav.innerHTML = '';

    if (user) {
        // Add Notes link
        let notesNav = createElement('li', 'nav-item');

        let notesLink = createElement('button',
            `btn btn-link nav-link${view === Views.calendar ? ' active' : ''}`,
            'Notes');
        notesLink.setAttribute('onclick', 'getSections();');
        notesNav.appendChild(notesLink);

        authenticatedNav.appendChild(notesNav);
    }
}

function showAccountNav(user) {

    accountNav.innerHTML = '';

    if (user) {
        // Show the "signed-in" nav
        accountNav.className = 'nav-item dropdown';

        let dropdown = createElement('a', 'nav-link dropdown-toggle');
        dropdown.setAttribute('data-toggle', 'dropdown');
        dropdown.setAttribute('role', 'button');
        accountNav.appendChild(dropdown);

        let userIcon = createElement('i',
            'far fa-user-circle fa-lg rounded-circle align-self-center');
        userIcon.style.width = '32px';
        dropdown.appendChild(userIcon);

        let menu = createElement('div', 'dropdown-menu dropdown-menu-right');
        dropdown.appendChild(menu);

        let userName = createElement('h5', 'dropdown-item-text mb-0', user.pageHeader);
        menu.appendChild(userName);

        let userEmail = createElement('p', 'dropdown-item-text text-muted mb-0', user.mail || user.userPrincipalName);
        menu.appendChild(userEmail);

        let divider = createElement('div', 'dropdown-divider');
        menu.appendChild(divider);

        let signOutButton = createElement('button', 'dropdown-item', 'Sign out');
        signOutButton.setAttribute('onclick', 'signOut();');
        menu.appendChild(signOutButton);
    } else {
        // Show a "sign in" button
        accountNav.className = 'nav-item';

        let signInButton = createElement('button', 'btn btn-link nav-link', 'Sign in');
        signInButton.setAttribute('onclick', 'signIn();');
        accountNav.appendChild(signInButton);
    }
}

function showWelcomeMessage(user) {
    // Create jumbotron
    let jumbotron = createElement('div', 'jumbotron');

    let heading = createElement('h1', null, 'OneNote Export');
    jumbotron.appendChild(heading);

    let lead = createElement('p', 'lead',
        'This app downloads your OneNote notes');
    jumbotron.appendChild(lead);

    if (user) {
        // Welcome the user by name
        let welcomeMessage = createElement('h4', null, `Welcome ${user.displayName}!`);
        jumbotron.appendChild(welcomeMessage);

    } else {
        // Show a sign in button in the jumbotron
        let signInButton = createElement('button', 'btn btn-primary btn-large',
            'Click here to sign in');
        signInButton.setAttribute('onclick', 'signIn();')
        jumbotron.appendChild(signInButton);
    }

    mainContainer.innerHTML = '';
    mainContainer.appendChild(jumbotron);
}

function showError(error) {
    let alert = createElement('div', 'alert alert-danger');

    let message = createElement('p', 'mb-3', error.message);
    alert.appendChild(message);

    if (error.debug) {
        let pre = createElement('pre', 'alert-pre border bg-light p-2');
        alert.appendChild(pre);

        let code = createElement('code', 'text-break text-wrap',
            JSON.stringify(error.debug, null, 2));
        pre.appendChild(code);
    }

    mainContainer.innerHTML = '';
    mainContainer.appendChild(alert);
}

function showPage(page) {
    let iframe = document.createElement('iframe');
    mainContainer.appendChild(iframe);
    iframe.contentWindow.document.write(page.documentElement.outerHTML);

    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    var img = zip.folder("images");
    img.file("smile.html", page.documentElement.outerHTML);


    var writeStream = streamSaver.createWriteStream('output.zip').getWriter();
    zip
        .generateInternalStream({ type: "uint8array" })
        .on('data', function (data, metadata) {
            writeStream.write(data);
        })
        .on('error', function (e) {
            updatePage(Views.error, e);
        })
        .on('end', function () {
            writeStream.close();
        }).resume();




}

function showPages(pages) {
    let div = document.createElement('div');

    div.appendChild(createElement('h1', 'mb-3', 'Pages'));


    let table = createElement('table', 'table');
    div.appendChild(table);

    let thead = document.createElement('thead');
    table.appendChild(thead);

    let headerrow = document.createElement('tr');
    thead.appendChild(headerrow);

    let pageHeader = createElement('th', null, 'Page');
    pageHeader.setAttribute('scope', 'col');
    headerrow.appendChild(pageHeader);


    let showPageHeader = createElement('th', null, 'Show page');
    showPageHeader.setAttribute('scope', 'col');
    headerrow.appendChild(showPageHeader);

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);


    for (const page of pages) {
        let pagerow = document.createElement('tr');
        pagerow.setAttribute('key', page.id);
        tbody.appendChild(pagerow);

        let pageCell = createElement('td', null, page.title);
        pagerow.appendChild(pageCell);

        let showPageButtonCell = createElement('td', null);
        let showPageButton = createElement('button', 'btn btn-light btn-sm mb-3', 'Show page');
        showPageButton.setAttribute('onclick', 'getPage(\'' + page.contentUrl + '\');');
        // showPageButton.setAttribute('onclick', 'getPage(\'' + page.content + '\');');
        showPageButtonCell.appendChild(showPageButton);
        pagerow.appendChild(showPageButtonCell);
    }


    mainContainer.innerHTML = '';
    mainContainer.appendChild(div);
}


function showSections(sections) {
    let div = document.createElement('div');

    div.appendChild(createElement('h1', 'mb-3', 'Sections'));


    let table = createElement('table', 'table');
    div.appendChild(table);

    let thead = document.createElement('thead');
    table.appendChild(thead);

    let headerrow = document.createElement('tr');
    thead.appendChild(headerrow);

    let pageHeader = createElement('th', null, 'Notebook');
    pageHeader.setAttribute('scope', 'col');
    headerrow.appendChild(pageHeader);

    let sectionGroupHeader = createElement('th', null, 'Section Group');
    sectionGroupHeader.setAttribute('scope', 'col');
    headerrow.appendChild(sectionGroupHeader);

    let sectionHeader = createElement('th', null, 'Section');
    sectionHeader.setAttribute('scope', 'col');
    headerrow.appendChild(sectionHeader);

    let showPageHeader = createElement('th', null, 'Show pages');
    showPageHeader.setAttribute('scope', 'col');
    headerrow.appendChild(showPageHeader);

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);


    for (const section of sections) {
        let pagerow = document.createElement('tr');
        pagerow.setAttribute('key', section.id);
        tbody.appendChild(pagerow);

        let pageCell = createElement('td', null, section.notebookName);
        pagerow.appendChild(pageCell);

        let sectionGroupCell = createElement('td', null, section.sectionGroupName);
        pagerow.appendChild(sectionGroupCell);

        let sectionCell = createElement('td', null, section.displayName);
        pagerow.appendChild(sectionCell);

        let showPagesButtonCell = createElement('td', null);
        let showPagesButton = createElement('button', 'btn btn-light btn-sm mb-3', 'Show pages');
        showPagesButton.setAttribute('onclick', 'getPages(\'' + section.pagesUrl + '\');');
        showPagesButtonCell.appendChild(showPagesButton);
        let savePagesButton = createElement('button', 'btn btn-light btn-sm mb-3', 'Save pages');
        savePagesButton.setAttribute('onclick', 'savePages(\'' + section.notebookName + '\', \'' + section.sectionGroupName + '\', \'' + section.displayName + '\',\'' + section.pagesUrl + '\');');
        showPagesButtonCell.appendChild(savePagesButton);
        pagerow.appendChild(showPagesButtonCell);
    }


    mainContainer.innerHTML = '';
    mainContainer.appendChild(div);
}

// <updatePageSnippet>
function updatePage(view, data) {
    if (!view) {
        view = Views.home;
    }

    const user = JSON.parse(sessionStorage.getItem('graphUser'));

    showAccountNav(user);
    showAuthenticatedNav(user, view);

    switch (view) {
        case Views.error:
            showError(data);
            break;
        case Views.home:
            showWelcomeMessage(user);
            break;
        case Views.notes:
            showSections(data);
            break;
        case Views.pages:
            showPages(data);
            break;
        case Views.page:
            showPage(data);
            break;
    }
}
// </updatePageSnippet>

updatePage(Views.home);
