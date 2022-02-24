import AbstractNode from "./a-node.mjs";

export default class LinkedList {
    private head: null | AbstractNode;
    private tail: null;

    constructor(data?: Array<AbstractNode>){
        this.head = (data) ? data[0]: null;
        this.tail = null;

        if (data){
            
        }
        
    }
}