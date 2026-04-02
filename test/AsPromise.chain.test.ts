import { AsPromise } from "../src/AsPromise";

class C4 {
    a:string = "hello";
}


function main3() {
  new AsPromise<string>((resolve:(value:string)=>void,rejects) => {
  setTimeout(() => {
    console.log("timeout 1");
    resolve("resolve 1");
  }, 100);
  
    }).then<C4>((value) => {
    console.log(`then triggered1: ${value}`);
    return new AsPromise<C4>((resolve:(value:C4)=>void, reject) => {
        setTimeout(() => {
            console.log("timeout 2");
            let c4 = new C4();
            c4.a = "c4";
            resolve(c4);
        }, 100);
    });
    }).then<Object>((value:C4) => {
        console.log(`then triggered2: ${value.a}`);
        return null;
    });
}

main3();






