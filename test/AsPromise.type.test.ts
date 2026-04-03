export class AsPromise2<T> {
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

    then<U>(onFulfilled:(value:T)=>Object|null): AsPromise2<U> {
         return new AsPromise2<U>((resolve:(value:U)=>void, reject) => {
        this.onThen = (value: T) => {
            const result = onFulfilled(value);
            if (result instanceof AsPromise2) {
                (result as AsPromise2<U>).then<U>((v: U): (Object|null) => {
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
    
}


export function foo1(p1: Promise<string>){
    let p2:Promise<Object> = p1;
    p2;
}


export function foo2(p1: AsPromise2<string>){
    let p2:AsPromise2<Object> = p1;
    p2;
}
