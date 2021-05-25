/* ./worker/custom.d.ts */

declare module 'comlink-loader!*' {
    class WebpackWorker extends Worker {
        constructor();

        // Add any custom functions to this class.
        // Make note that the return type needs to be wrapped in a promise.
        processData(board: any[][], path: any[], block: any | undefined): Promise<any[] | undefined>;
    }

    export = WebpackWorker;
}