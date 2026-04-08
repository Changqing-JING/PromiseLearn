import { AsPromise } from "../src/AsPromise";
let setTimeout_wrapper = setTimeout;
let trace = console.log;
type i32 = number;

function api(label: string, ms: i32): AsPromise<string> {
    return new AsPromise<string>((resolve, reject:(reason:Object|null)=>void) => {
        setTimeout_wrapper(() => {
            trace(`${label} timeout`);
            resolve(label);
        }, ms)
    });
}

function mainAll():void {
    const p1 = api("api1", 20);
    const p2 = api("api2", 10);
    const p3 = api("api3", 30);

    AsPromise.all([p1, p2, p3]).then<Object>((value:(Object|null)[]|null):Object|null => {
        let msg = "all done: ";
        for(let i = 0; i < value!.length; i++){
            msg += value![i] as string + " ";
        }
        trace(msg);
        return null;
    });
}

mainAll();