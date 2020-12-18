
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
