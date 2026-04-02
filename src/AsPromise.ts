export class AsPromise<T> {
    private onThen: ((value:T) => void)|null = null;
    private resolved: boolean = false;
    private resolvedValue: T|null = null;
    constructor(fnc: (resolve:(value:T)=>void, reject:(reason:any)=>void)=>void){
        let resolve = (value:T) => {
            this.resolved = true;
            this.resolvedValue = value;
            if(this.onThen){
                this.onThen(value);
            }
        };

        let reject = (reason:any) => {
        };

        fnc(resolve, reject);
    }

    then<U>(onFulfilled:(value:T)=>Object|null): AsPromise<U> {
         return new AsPromise<U>((resolve:(value:U)=>void, reject) => {
        this.onThen = (value: T) => {
            const result = onFulfilled(value);
            if (result instanceof AsPromise) {
                (result as AsPromise<U>).then<U>((v: U): (Object|null) => {
                    resolve(v as U);
                    return null;
                });
            } else {
                //returns a value, resolve it
                resolve(result as U);
            }
        };
        if(this.resolved){
            this.onThen(this.resolvedValue as T);
        }
    });
    }

    static resolve<T>(value: T): AsPromise<T> {
        return new AsPromise<T>((resolve:(value:T)=>void, reject) => {
            resolve(value);
        });
    }
    
}

let counter = 0;

function delay3(ms: number): AsPromise<string> {
  return new AsPromise<string>((resolve, reject) =>{
        setTimeout(() => {
            resolve(`waited ${ms}ms`)
        },
        ms);
    });
}

