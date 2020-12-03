import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
// import { Table } from 'reactstrap';
import {
    Button
} from 'reactstrap';

import DropdownTreeSelect from "react-dropdown-tree-select";
import { OnenotePage } from 'microsoft-graph';
import { config } from './Config';
// import { getUserWeekCalendar } from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';

interface NotesState {
    notesLoaded: boolean;
    notes: OnenotePage[];
    tree: any[];
}

class Notes extends React.Component<AuthComponentProps, NotesState> {
    selected: { 'label': string, 'children': { 'label': string, 'children': { 'label': string, 'children': { 'label': string, 'checked': boolean, 'URL': string }[] }[] }[] }[] = 
    [{ 'label': '', 'children': [{ 'label': '', 'children': [{ 'label': '', 'children': [{ 'label': '', checked: false, 'URL': '' }] }] }] }];

    constructor(props: any) {
        super(props);

        this.state = {
            notesLoaded: false,
            notes: [],
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
        let node = searchNode(this.selected, currentNode['id']);

        let getleafs = function (tree: any[], collection: any[]) {
            for (const node of tree) {
                if (!node["children"]) {
                    collection.push(node);
                } else {
                    getleafs(node["children"], collection);
                }
            }
        }
        let selected: any[] = [];
        getleafs([node], selected);

        for (const leaf of selected) {
            leaf['checked'] = currentNode['checked'];
        }



        // this.selected[currentNode.notebook].children[currentNode.section].children[currentNode.child]['checked'] = currentNode.checked;
        // console.log('onChange::', currentNode, selectedNodes);
    }

    async exportNotes() {
        console.log("Exporting ...");

        let getleafs = function (tree: any[], collection: any[]) {
            for (const node of tree) {
                if (!node["children"]) {
                    if (node["checked"]) {
                        collection.push(node);
                    }
                } else {
                    getleafs(node["children"], collection);
                }
            }
        }
        let selected: any[] = [];
        getleafs(this.selected, selected);
        for (const leaf of selected) {
            console.log("... " + leaf['label'] + "  " + leaf['URL']);
        }
    }

    async componentDidUpdate() {
        if (this.state.notesLoaded) {
            return;
        }
        try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);

            // Get the user's notes
            //var events = await getUserWeekCalendar(accessToken, this.props.user.timeZone, startOfWeek);
            let notes = [{ 'title': 'First Note' }];
            let tree = [
                {
                    "label": "VP Accounting",
                    "id": 0,
                    "children": [
                        {
                            "label": "Subsection",
                            "id": 1,
                            "children": [{
                                "label": "iWay",
                                "children": [
                                    {
                                        "label": "Universidad de Especialidades del Espíritu Santo",
                                        "id": 2,
                                        "notebook": 0,
                                        "section": 0,
                                        "child": 0,
                                        "checked": false,
                                        "URL": "hhtttt"
                                    },
                                    {
                                        "label": "Marmara University",
                                        "id": 3,
                                        "notebook": 0,
                                        "section": 0,
                                        "child": 1,
                                        "checked": false,
                                        "URL": "hhtttt"
                                    },
                                    {
                                        "label": "Baghdad College of Pharmacy",
                                        "id": 4,
                                        "notebook": 0,
                                        "section": 0,
                                        "child": 2,
                                        "checked": false,
                                        "URL": "hhtttt"
                                    }
                                ]
                            }]
                        }]
                }];
            this.selected = tree;
            // Update the array of notes in state
            this.setState({
                notesLoaded: true,
                notes: notes,
                tree: tree
            });
        }
        catch (err) {
            this.props.setError('ERROR', JSON.stringify(err));
        }
    }

    render() {
        return (
            <div>
                <h4>Select Notebooks, Sections, Pages to export</h4>

                <DropdownTreeSelect
                    data={this.state.tree}
                    showDropdown="initial"
                    showPartiallySelected={true}
                    onChange={this.onChange}
                    className="mdl-demo"
                />
                <Button color="primary" onClick={this.exportNotes}>Export your notes</Button>
            </div>
        );
    }
}

export default withAuthProvider(Notes);