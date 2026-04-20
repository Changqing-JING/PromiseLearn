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

function mainThenCatch(): void {
    failingApi("apiThenCatch", 10)
        .then<string>((value: string|null): Object|null => {
            trace(`unexpected resolve: ${value}`);
            return value ?? "unexpected-null";
        })
        .catch<string>((reason: Object|null): Object|null => {
            trace(`caught after then: ${reason as string}`);
            return "recovered by catch";
        })
        .then<Object>((value: string|null): Object|null => {
            trace(`then after catch: ${value}`);
            return null;
        });
}

mainThenCatch();