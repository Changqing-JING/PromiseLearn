import { AsPromise } from "../src/AsPromise";

let trace = console.log;

function mainResolveAndReject(): void {
    AsPromise.resolve<string>("static resolve")
        .then<string>((value: string|null): Object|null => {
            trace(`resolved value: ${value}`);
            return `${value} handled`;
        })
        .then<Object>((value: string|null): Object|null => {
            trace(`resolve chain: ${value}`);
            return null;
        });

    AsPromise.reject<string>("static reject")
        .catch<string>((reason: Object|null): Object|null => {
            trace(`rejected reason: ${reason as string}`);
            return "recovered from reject";
        })
        .then<Object>((value: string|null): Object|null => {
            trace(`reject chain: ${value}`);
            return null;
        });
}

mainResolveAndReject();