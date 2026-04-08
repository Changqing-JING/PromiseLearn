import { AsPromiseBase, AsPromise } from "../src/AsPromise";

let trace = console.log;
let setTimeout_wrapper = setTimeout;
type i32 = number;

class C4 {
    a:string = "hello";
}


function awaiter2(fnc:(value:Object|null) => AsPromiseBase|null): AsPromiseBase{
    let drive: (value:Object|null) => AsPromiseBase;
    drive = (value:Object|null): AsPromiseBase => {
        let promise: AsPromiseBase | null = fnc(value);

         if(promise != null){
                return promise.thenBase(drive);
         }else{
                return new AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
                     resolve(null);
                });
         }
    };
    
   return drive(null);
}



function api1(ms: i32): AsPromise<string> {
    return new AsPromise<string>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
        setTimeout_wrapper(() => {
            trace(`api1 timeout`);
            resolve(`waited ${ms}ms`)
        }, ms)
    });
}

function api2(ms: i32): AsPromise<C4> {
    return new AsPromise<C4>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
        setTimeout_wrapper(() => {
            trace(`api2 timeout`);
            let c4 = new C4();
            c4.a = "abc";
            resolve(c4);
        }, ms)
    });
}



function main5():AsPromiseBase{
   
    let label:i32 = 0;
    let c4: C4;

    function inner(value:Object|null): AsPromiseBase|null{
        switch(label){
            case 0:
                c4 = new C4();
                trace(`start`);
                label = 1;
                return (api1(1) as AsPromiseBase);
            case 1:
                const result = value as string;
                trace(`continue: ${c4.a} ${result}`);
                label = 2;
                return (api2(2) as AsPromiseBase);
            case 2:
                const result2 = value as C4;
                trace(`continue: ${c4.a} ${result2.a}`);
                label = 3;
                return null;
        }
        trace("invalid label");
        return null;
    }

    return awaiter2(inner); 
}

export function _start():void{
    let promise5 = main5();
    promise5.thenBase((v:Object|null):Object|null => 
    { 
        trace("done");
        return null;
    }
    );
}

_start();


