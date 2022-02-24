import {default as AbstractNode} from '../libs/data-structures/a-node.mjs';

describe("Abstract Node Class", ()=>{
    let name = new AbstractNode('Nick', 'programmer');
    let arrayVal = new AbstractNode(0, 'A');

    it("initializes name properly.", ()=>{
        expect(name.getAlias() as string).toEqual('Nick');
        expect(name).not.toBeNull();
    });

    it("initializes and returns value properly.", ()=>{
        expect(name.getValue()).toEqual('programmer');
    });

    it("leaves <next> and <last> undefined at init.", ()=>{
        expect(name.next).toEqual(undefined);
        expect(name.last).toEqual(undefined);
    });
});