import { BOTTOM, DIMENSIONS_LARGE, DIMENSIONS_MEDIUM, DIMENSIONS_SMALL, DIMENSIONS_X_SMALL, LEFT, LEVELS, RIGHT, TOP } from "../constants"
import Block from "../models/Block"

export const generateBoard = (sizeX: number, sizeY: number) => {
    let blocks: Block[][] = new Array<Block[]>(sizeX);
    for (let i = 0; i < sizeY; i++) {
        blocks[i] = new Array<Block>(sizeX);
        for (let j = 0; j < sizeX; j++) {
            blocks[i][j] = new Block(j, i, sizeX, sizeY);
        }
    }
    blocks = createPath(blocks);
    blocks = linkBoard(blocks);
    return blocks;
}

export const linkBoard = (blocks: Block[][]) => {
    let sizeY = blocks.length;
    let sizeX = blocks[0].length;
    for (let i = 0; i < sizeY; i++) {
        if (!blocks[i]) {
            return blocks;
        }
        for (let j = 0; j < sizeX; j++) {
            const block = blocks[i][j];
            block.sides[TOP].block = getNeighbor(blocks, block, TOP);
            block.sides[LEFT].block = getNeighbor(blocks, block, LEFT);
            block.sides[BOTTOM].block = getNeighbor(blocks, block, BOTTOM);
            block.sides[RIGHT].block = getNeighbor(blocks, block, RIGHT);
        }
    }
    return blocks;
}

export const createPath = (blocks: Block[][]) => {
    let block: Block | undefined = blocks[0][0];

    if (Math.random() < 0.5) {
        block.sides[LEFT].open = true;
    } else {
        block.sides[BOTTOM].open = true
    };

    let i = 0, j = 0;
    let direction: number = 0;
    let change = false;
    while (i < blocks.length && blocks[i] && j < blocks[0].length) {
        block = blocks[i][j];
        if (change) {
            block.sides[mapDirection(direction)].open = true;
        }
        let prevDirection: number = direction;
        direction = Math.random();
        direction = Math.floor(Math.random() * 4);
        if (direction === mapDirection(prevDirection)) { continue };
        if (direction === RIGHT && j < blocks.length) {
            block.sides[RIGHT].open = true;
            change = true;
            j++;
        } else if ((direction === TOP || direction === LEFT) && i < blocks[0].length) {
            block.sides[TOP].open = true;
            change = true;
            i++;
        } else if (direction === LEFT && j > 0) {
            // block.sides[LEFT].open = true;
            // change = true;
            // j--;
        } else if (direction === BOTTOM && i > 0) {
            block.sides[BOTTOM].open = true;
            change = true;
            i--;
        };
    }
    block.exit = direction;

    return blocks;
}

export const getNextBlockCoords = (currentBlock: number[], direction: number): number[] => {

    let next: number[] = [currentBlock[0], currentBlock[1]];
    if (direction === LEFT) {
        next[0]--;
    }
    if (direction === TOP) {
        next[1]++;
    }
    if (direction === RIGHT) {
        next[0]++;
    }
    if (direction === BOTTOM) {
        next[1]--;
    }
    return next;
}

export const isMoveAllowed = (board: Block[][], current: number[], next: number[], direction: number): boolean => {
    if (next[0] < 0
        || next[1] < 0
        || next[0] > board[0].length - 1
        || next[1] > board.length - 1
        || !board[next[1]])
        return false;
    let mappedDirection = mapDirection(direction);

    let prev = [current[0], current[1]];

    return board[next[1]][next[0]].sides[mappedDirection].open &&
        board[prev[1]][prev[0]].sides[direction].open;
}

export const mapDirection = (direction: number): number => {
    return (direction + 2) % 4;
}

export const getShortestPath = (board: Block[][], path: Block[], block: Block | undefined): Block[] | undefined => {
    const paths = getPossiblePaths(board, [], board[0][0]);
    const shortestPath = getShortest(paths);
    // return paths;
    return shortestPath as Block[] || path;
}

const getShortest = (paths: Block[][] | undefined): Block[] | undefined => {
    const shortest = paths?.reduce((p, c) => {
        return p.length > c.length ? c : p;
    }, { length: Infinity });
    return shortest as Block[] | undefined;
}

export const getPossiblePaths = (board: Block[][], path: Block[], block: Block | undefined, possiblePaths: Block[][] = []): Block[][] | undefined => {
    if (block === undefined) {
        return undefined;
    }
    if (path.find((b) => b === block)) {
        return undefined;
    }


    if (block.exit > -1) {
        possiblePaths.push(path);
        return possiblePaths;
    }

    if (possiblePaths.find((p) => p.length < path.length)) {
        return undefined;
    }

    const top = block.sides[TOP].block;
    // const left = block.sides[LEFT].block;
    const bottom = block.sides[BOTTOM].block;
    const right = block.sides[RIGHT].block;

    top && getPossiblePaths(board, [...path, block], top, possiblePaths);
    // left && getPossiblePaths(board, [...path, block], left, possiblePaths);
    bottom && getPossiblePaths(board, [...path, block], bottom, possiblePaths);
    right && getPossiblePaths(board, [...path, block], right, possiblePaths);

    return possiblePaths;
}

export const getNeighbor = (board: Block[][], block: Block, direction: number): Block | undefined => {

    let neighbor: Block | undefined = undefined;
    if (!block.sides[direction].open) {
        return undefined;
    }
    if (direction === TOP && block.y < board.length - 1 && board[block.y + 1]) {
        neighbor = board[block.y + 1][block.x];
    }
    if (direction === LEFT && block.x > 0) {
        neighbor = board[block.y][block.x - 1];
    }
    if (direction === BOTTOM && block.y > 0) {
        neighbor = board[block.y - 1][block.x];
    }
    if (direction === RIGHT && block.x < board[0].length - 1) {
        neighbor = board[block.y][block.x + 1];
    }
    return neighbor && neighbor.sides[mapDirection(direction)].open ? neighbor : undefined;
}

export const getSize = (level: number) => {
    if (LEVELS[level] < 15) return DIMENSIONS_LARGE;
    if (LEVELS[level] < 21) return DIMENSIONS_MEDIUM;
    if (LEVELS[level] < 30) return DIMENSIONS_SMALL;
    return DIMENSIONS_X_SMALL;
}