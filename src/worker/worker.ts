/* ./worker/worker.ts */

import Block from "../models/Block";
import { getShortestPath } from "../util/util";

export async function processData(board: Block[][], path: Block[], block: Block | undefined): Promise<Block[] | undefined> {
    // Process the data without stalling the UI
    return getShortestPath(board,path, board[0][0]);

}