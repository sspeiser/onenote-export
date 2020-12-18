import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import {
    Button
} from 'reactstrap';

import DropdownTreeSelect from "react-dropdown-tree-select";

import { config } from './Config';
import { getPageTree, savePages } from './GraphService';
import { PageTree, TreePage } from "./PageTree";
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import { savePagesEnex } from './OneNoteSource';

interface NotesState {
    notesLoaded: boolean;
    notesExporting: boolean;
    tree: PageTree;
}

class Notes extends React.Component<AuthComponentProps, NotesState> {
    selectedPages: TreePage[] = [];

    constructor(props: any) {
        super(props);

        this.state = {
            notesLoaded: false,
            notesExporting: false,
            tree: []
        };
        this.exportNotes = this.exportNotes.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(currentNode: any, selectedNodes: any) {

        let searchNode = function (tree: any[], id: any): any {
            for (const node of tree) {
                if (node['id'] === id)
                    return node;
                if (node['children']) {
                    let found = searchNode(node.children, id);
                    if (found != null) {
                        return found;
                    }
                }
            }
        }
        let selectedNodesTree: any[] = [];
        for (const node of selectedNodes) {
            selectedNodesTree.push(searchNode(this.state.tree, node['id']));
        }

        let getleafs = function (tree: any[], collection: any[]) {
            for (const node of tree) {
                if (!node["children"]) {
                    collection.push(node);
                } else {
                    getleafs(node["children"], collection);
                }
            }
        }
        let selectedPages: any[] = [];
        getleafs(selectedNodesTree, selectedPages);

        this.selectedPages = selectedPages;
    }

    async exportNotes() {
        this.setState({ notesExporting: true });
        console.log("Exporting ...");

        for (const leaf of this.selectedPages) {
            console.log("... " + leaf.label + "  " + leaf.contentURL);
        }

        let saveConfig = { markdown: false, html: true, resources: true, images: true, enex: false };

        savePages(this.props.getAccessToken(config.scopes), this.selectedPages, saveConfig)
            .catch((error) => this.props.setError('ERROR', JSON.stringify(error)))
            .finally(() => this.setState({ notesExporting: false }));
    }

    async exportNotesEnex() {
        this.setState({ notesExporting: true });
        console.log("Exporting ...");

        for (const leaf of this.selectedPages) {
            console.log("... " + leaf.label + "  " + leaf.contentURL);
        }

        let saveConfig = { markdown: false, html: true, resources: true, images: true, enex: true };
        savePagesEnex(this.props.getAccessToken(config.scopes), this.selectedPages, saveConfig)
            .catch((error) => this.props.setError('ERROR', JSON.stringify(error)))
            .finally(() => this.setState({ notesExporting: false }));
    }


    async componentDidUpdate() {
        if (this.state.notesLoaded) {
            return;
        }
        try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);

            // Get the user's notes
            let tree = await getPageTree(accessToken);

            // Update the array of notes in state
            this.setState({
                notesLoaded: true,
                tree: tree
            });
        }
        catch (err) {
            this.props.setError('ERROR', JSON.stringify(err));
        }
    }

    waiting() {
        return <div><p>Loading your notebooks ... this can take a while</p>

            <p>
                <PacmanLoader css={"border-color: black; border: 2px;"}
                    size={50}
                    color={"blue"}
                    loading={!this.state.notesLoaded} />
            </p>
        </div>;
    }

    exporting() {
        return <div><p>Exporting your notebooks ... this can take a while</p>

            <p>
                <PacmanLoader css={"border-color: black; border: 2px;"}
                    size={50}
                    color={"blue"}
                    loading={!this.state.notesExporting} />
            </p>
        </div>;
    }

    done() {
        return <div>
            <DropdownTreeSelect
                data={this.state.tree}
                showDropdown="initial"
                // texts={{ placeholder: "Loading your notebooks" }}
                showPartiallySelected={true}
                onChange={this.onChange}
                className="mdl-demo"
            />
            <Button color="primary" onClick={this.exportNotes.bind(this)}>Export your notes as a zip file<br /> containing HTML files and resources</Button> &nbsp; &nbsp; &nbsp;<br /><br />
            <Button color="primary" onClick={this.exportNotesEnex.bind(this)}>Export your notes as ENEX-File - <br />Evernote export format that can be<br /> imported into many note applications</Button><br />
            <br />
            How to proceed from here depends on which tool you want to use in the future:<br />
            <ul>
                <li>General purpose editor (e.g. Atom, Visual Studio Code): download zip and open directory in your editor. Maybe convert HTML files to markdown, e.g. using <a href="https://pandoc.org/demos.html" target="_blank" rel="noreferrer">pandoc, see example 12</a></li>
                <li>Standard Notes: both ENEX and zip should be importable via the provided tools. It will not import resources.</li>
                <li>Evernote: download ENEX and import in desktop application. Some resources and images might be damaged.</li>
                <li>Joplin: download ENEX and import as Markdown. Sections will be converted to tags. As an alternative you can download the zip, unzip it and import the HTML directory</li>
                <li>Anything else: download both and see which one imports better</li>
            </ul>
        </div>
    }

    render() {
        return (
            <div>
                <h4>Select Notebooks, Sections, Pages to export</h4>
                {this.state.notesLoaded ? (this.state.notesExporting ? this.exporting() : this.done()) : this.waiting()}
            </div>
        );
    }
}

export default withAuthProvider(Notes);