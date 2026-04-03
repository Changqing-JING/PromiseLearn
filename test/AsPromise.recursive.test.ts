import { AsPromise } from "../src/AsPromise";

class C4 {
    a:string = "hello";
}


function awaiter2(fnc:(value:Object|null) => AsPromise<Object|null>|null): AsPromise<Object|null>{

    function drive(value:Object|null): AsPromise<Object|null>{
         let promise: AsPromise<Object | null> | null = fnc(value);

         if(promise != null){
            return promise.then(drive);
         }else{
            return AsPromise.resolve<Object|null>(null);
         }
    }
    
   return drive(null);
}



function api1(ms: number): AsPromise<string> {
    return new AsPromise<string>((resolve) => setTimeout(() => {
        console.log(`api1 timeout`);
        resolve(`waited ${ms}ms`)
    }, ms));
}

function api2(ms: number): AsPromise<C4> {
    return new AsPromise<C4>((resolve) => setTimeout(() => {
        console.log(`api2 timeout`);
        let c4 = new C4();
        c4.a = "abc";
        resolve(c4);
    }, ms));
}



function main5(){
   
    let label:number = 0;
    let c4: C4;

    function inner(value:Object|null): AsPromise<Object|null>|null{
        switch(label){
            case 0:
                c4 = new C4();
                console.log(`start`);
                label = 1;
                return (api1(1) as unknown as AsPromise<Object|null>);
            case 1:
                const result = value as string;
                console.log(`continue: ${c4.a} ${result}`);
                label = 2;
                return (api2(2) as unknown as AsPromise<Object|null>);
            case 2:
                const result2 = value as C4;
                console.log(`continue: ${c4.a} ${result2.a}`);
                label = 3;
                return null;
        }
        console.log("invalid label");
        return null;
    }

    return awaiter2(inner); 
}

let promise5 = main5();
promise5.then((v:Object|null):Object|null => 
   { 
    console.log("done");
    return null;
   }
);
