import { AsPromise } from "../src/AsPromise";

let setTimeout_wrapper = setTimeout;
let trace = console.log;
type i32 = number;

function failingApi(label: string, ms: i32): AsPromise<string> {
    return new AsPromise<string>((resolve, reject:(reason:Object|null)=>void) => {
        setTimeout_wrapper(() => {
            trace(`${label} timeout`);
            reject(`${label} failed`);
        }, ms)
    });
}

function mainReject(): void {
    failingApi("apiReject", 10).then<Object>(
        (value: string|null): Object|null => {
            trace(`unexpected resolve: ${value}`);
            return null;
        },
        (reason: Object|null): Object|null => {
            trace(`caught by then: ${reason as string}`);
            return null;
        }
    );

    AsPromise.reject("static reject").catch((reason: Object|null): Object|null => {
        trace(`caught by catch: ${reason as string}`);
        return null;
    });
}

mainReject();