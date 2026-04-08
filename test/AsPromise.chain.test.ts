import { AsPromise } from "../src/AsPromise";

let setTimeout_wrapper = setTimeout;
let trace = console.log;

class C4 {
    a:string = "hello";
}


function main3():void {
  new AsPromise<string>((resolve:(value:Object|null)=>void,reject:(reason:Object|null)=>void) => {
  setTimeout_wrapper(() => {
    trace("timeout 1");
    resolve("resolve 1");
  }, 100);
  
    }).then<C4>((value:string|null) => {
    trace(`then triggered1: ${value}`);
    return new AsPromise<C4>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
        setTimeout_wrapper(() => {
            trace("timeout 2");
            let c4 = new C4();
            c4.a = "c4";
            resolve(c4);
        }, 100);
    });
     })
     .then<Object>((value:C4|null) => {
        trace(`then triggered2: ${value!.a}`);
        return null;
    });
}

main3();






