enum _AsPromiseState {
    Pending,
    Fulfilled,
    Rejected,
}

export class _AsPromiseBase {
    private onThen: ((value:Object|null) => void)|null = null;
    private onCatch: ((reason:Object|null) => void)|null = null;
    private state: _AsPromiseState = _AsPromiseState.Pending;
    private fulfilledValue: Object|null = null;
    private rejectedReason: Object|null = null;
    constructor(executor: (resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void)=>void){
        let handleResolve = (value:Object|null):void => {
            this.state = _AsPromiseState.Fulfilled;
            this.fulfilledValue = value;
            if(this.onThen){
                this.onThen(value);
            }
        };

        let handleReject = (reason:Object|null):void => {
            this.state = _AsPromiseState.Rejected;
            this.rejectedReason = reason;
            if(this.onCatch){
                this.onCatch(reason);
            }
        };

        executor(handleResolve, handleReject);
    }

    thenBase(onFulfilled:((value:Object|null)=>Object|null)|null, onRejected:((reason:Object|null)=>Object|null)|null = null): _AsPromiseBase {
         return new _AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            this.onThen = (value: Object|null) => {
                if(onFulfilled)
                {
                    const result = onFulfilled(value);
                    if (result instanceof _AsPromiseBase) {
                        (result as _AsPromiseBase).thenBase((v: Object|null): (Object|null) => {
                            resolve(v);
                            return null;
                        },
                        (reason: Object|null): (Object|null) => {
                            reject(reason);
                            return null;
                        });
                    } else {
                        //returns a value, resolve it
                        resolve(result);
                    }
                }else{
                    resolve(value);
                }
            };

            this.onCatch = (reason: Object|null) => {
                if(onRejected){
                    const result = onRejected(reason);
                    if (result instanceof _AsPromiseBase) {
                        (result as _AsPromiseBase).thenBase((v: Object|null): (Object|null) => {
                            resolve(v);
                            return null;
                        },
                        (newReason: Object|null): (Object|null) => {
                            reject(newReason);
                            return null;
                        });
                    }else{
                        resolve(result);
                    }
                }else{
                    reject(reason);
                }
            }

            if(this.state === _AsPromiseState.Fulfilled){
                this.onThen(this.fulfilledValue);
            }else if(this.state === _AsPromiseState.Rejected){
                this.onCatch(this.rejectedReason);
            }
        });
    }

    static resolve(value: Object|null): _AsPromiseBase {
        return new _AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            resolve(value);
        });
    }

    static reject(reason: Object|null): _AsPromiseBase {
        return new _AsPromiseBase((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            reject(reason);
        });
    }
}


export class AsPromise<T> extends _AsPromiseBase {
    static resolve<T>(value: T|null): AsPromise<T> {
        return new AsPromise<T>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            resolve(value as Object|null);
        });
    }

    static reject<T>(reason: Object|null): AsPromise<T> {
        return new AsPromise<T>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            reject(reason);
        });
    }

    
    then<U>(onFulfilled:((value:T|null)=>Object|null)|null, onRejected:((reason:Object|null)=>Object|null)|null = null): AsPromise<U> {
        let onFulfilledWrapper = (value:Object|null): Object|null => {
            if(onFulfilled){
                return onFulfilled(value as T|null);
            }
           return null;
        };
        let p:_AsPromiseBase =  super.thenBase(onFulfilledWrapper, onRejected);
        return new AsPromise<U>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            p.thenBase((value:Object|null): Object|null => {
                resolve(value);
                return null;
            },
            (reason:Object|null): Object|null => {
                reject(reason);
                return null;
            });
        });
    }

    static all(promiseArr: _AsPromiseBase[]): AsPromise<(Object|null)[]> {

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

    catch<U>(onRejected: (reason:Object|null)=>Object|null): AsPromise<T|U> {
        let p:_AsPromiseBase = super.thenBase(null, onRejected);
        return new AsPromise<T|U>((resolve:(value:Object|null)=>void, reject:(reason:Object|null)=>void) => {
            p.thenBase((value:Object|null): Object|null => {
                resolve(value);
                return null;
            },
            (reason:Object|null): Object|null => {
                reject(reason);
                return null;
            });
        });
    }
}
