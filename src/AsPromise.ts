export class AsPromiseBase {
    private onThen: ((value:Object|null) => void)|null = null;
    private resolved: boolean = false;
    private resolvedValue: Object|null = null;
    constructor(fnc: (resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void)=>void){
        let resolve = (value:Object|null):void => {
            this.resolved = true;
            this.resolvedValue = value;
            if(this.onThen){
                this.onThen(value);
            }
        };

        let reject = (reason:Object|null):void => {
        };

        fnc(resolve, reject);
    }

    thenBase(onFulfilled:(value:Object|null)=>Object|null): AsPromiseBase {
         return new AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
        this.onThen = (value: Object|null) => {
            const result = onFulfilled(value);
            if (result instanceof AsPromiseBase) {
                (result as AsPromiseBase).thenBase((v: Object|null): (Object|null) => {
                    resolve(v);
                    return null;
                });
            } else {
                //returns a value, resolve it
                resolve(result);
            }
        };
        if(this.resolved){
            this.onThen(this.resolvedValue);
        }
    });
    }

    static resolve(value: Object|null): AsPromiseBase {
        return new AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            resolve(value);
        });
    }
    
}


export class AsPromise<T> extends AsPromiseBase {
    
    then<U>(onFulfilled:(value:T|null)=>Object|null): AsPromise<U> {
        let onFulfilledWrapper = (value:Object|null): Object|null => {
            return onFulfilled(value as T|null);
        };
        let p:AsPromiseBase =  super.thenBase(onFulfilledWrapper);
        return new AsPromise<U>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            p.thenBase((value:Object|null): Object|null => {
                resolve(value);
                return null;
            });
        });
    }

    static all(promiseArr: AsPromiseBase[]): AsPromise<(Object|null)[]> {

        return new AsPromise<(Object|null)[]> ((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            let  counter = 0;
            let values: (Object|null)[] = new Array<(Object|null)>();
            for(let i = 0; i < promiseArr.length; i++){
                promiseArr[i].thenBase((value:Object|null):Object|null => {
                    values.push(value);
                    counter++;
                    if(counter == promiseArr.length){
                        resolve(values);
                    }
                    return null;
                });
            }
        });
    }
}
