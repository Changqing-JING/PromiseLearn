import { AsPromise } from "../src/AsPromise";

class C4 {
    a:string = "hello";
}


function awaiter2(fnc:(value:Object|null) => AsPromise<Object|null>|null): AsPromise<Object|null>{

    function drive(value:Object|null): AsPromise<Object|null>{
         let promise = fnc(value);

         if(promise != null){
            return promise.then(drive);
         }else{
            return AsPromise.resolve<Object|null>(null);
         }
    }
    
   return drive(null);
}



function delay4(ms: number): AsPromise<string> {
    return new AsPromise((resolve) => setTimeout(() => {
        console.log(`delay4 timeout`);
        resolve(`waited ${ms}ms`)
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
                return (delay4(1) as unknown as AsPromise<Object|null>);
            case 1:
                const result = value as string;
                console.log(`continue: ${c4.a} ${result}`);
                label = 2;
                return (delay4(2) as unknown as AsPromise<Object|null>);
            case 2:
                const result2 = value as string;
                console.log(`continue: ${c4.a} ${result2}`);
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
