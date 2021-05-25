import { BOTTOM, LEFT, RIGHT, TOP } from "../constants";

export default class Block {
    id: string = "";
    sides: BlockSide[] = [];
    x: number = 0;
    y: number = 0;
    visited: boolean = false;
    index: string = '';
    exit: number = -1;
    constructor(x?: number, y?: number, maxX?: number, maxY?: number) {
        this.x = x || 0;
        this.y = y || 0;
        for (let i = 0; i < 4; i++) {
            let rand: boolean = false;
            rand = Math.random() < 0.3;
            if (i === LEFT || i === BOTTOM) rand = true;
            if (maxY && i === TOP && y === maxY - 1) {
                rand = false;
            }
            if (i === LEFT && x === 0) {
                rand = false;
            }
            if (i === BOTTOM && y === 0) {
                rand = false;
            }
            if (maxX && i === RIGHT && x === maxX - 1) {
                rand = false;
            }
            this.sides[i] = new BlockSide(rand);
        }
        this.id = Math.random().toString(32).slice(-8);
    }
}
class BlockSide {
    open: boolean = true;
    block?: Block;
    constructor(open: boolean) {
        this.open = open || false;
    }
}