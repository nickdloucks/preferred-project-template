export default class AbstractNode {
    private alias; // name of the node
    private value; // value of the node

    // public access methods:
    public readonly getValue;
    public setValue;
    public readonly getAlias;
    public setAlias;
    next?: AbstractNode;
    last?: AbstractNode;

    constructor (alias: string | number, val : unknown ){
        this.alias = alias;
        this.value = val;

        this.getValue = function(): unknown{
            return this.value;
        }
        this.setValue  = function(newVal: unknown): void {
            this.value = newVal;
        }
        this.getAlias = function(): unknown{
            return this.alias;
        }
        this.setAlias = function(newAlias: unknown):void {
            this.alias = newAlias as string;
        }
    }
}