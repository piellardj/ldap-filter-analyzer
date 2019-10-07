import LdapNode from "./ldap-node";
import ForwardStringReader from "../foward-string-reader";

enum Operation {
    AND = "&",
    OR = "|",
    NOT = "!",
}

class OperationNode extends LdapNode {
    public operation: Operation;
    public children: LdapNode[];

    public constructor() {
        super();
        this.children = [];
    }

    public parse(reader: ForwardStringReader): boolean {
        return false;
    }

    public isValid(): boolean {
        switch (this.operation) {
            case Operation.AND:
            case Operation.OR:
                return this.children.length >= 2;
            case Operation.NOT:
                return this.children.length === 1;
            default:
                return false;
        }
    }

    public toString(): string {
        const childrenStringArray: String[] = [];
        for (const child of this.children) {
            childrenStringArray.push(child.toString());
        }

        switch (this.operation) {
            case Operation.AND:
                return childrenStringArray.join(" AND ");
            case Operation.OR:
                return childrenStringArray.join(" OR ");
            case Operation.NOT:
                if (this.children.length !== 1) {
                    return "(INVALID OPERATION NODE: NOT SHOULD HAVE ONE CHILD";
                }
                return "NOT " + childrenStringArray[0];
            default:
                return "INVALID OPERATION NODE: UNKNOWN OPERATION";
        }
    }
}

export {
    Operation,
    OperationNode,
}
