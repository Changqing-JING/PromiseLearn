import { AsPromise } from "../src/AsPromise";

function api(label: string, ms: number): AsPromise<string> {
    return new AsPromise<string>((resolve) => setTimeout(() => {
        console.log(`${label} timeout`);
        resolve(label);
    }, ms));
}

function mainAll() {
    const p1 = api("api1", 20);
    const p2 = api("api2", 10);
    const p3 = api("api3", 30);

    AsPromise.all([p1, p2, p3]).thenBase((value:Object|null):Object|null => {
        console.log("all done");
        return null;
    });
}

mainAll();