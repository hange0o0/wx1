/**
 *
 * @author
 *
 */
class SharedObjectManager {
    public constructor() {
    }

    private static _instance: SharedObjectManager;
    public static getInstance():SharedObjectManager{
        if(!SharedObjectManager._instance)
            SharedObjectManager._instance = new SharedObjectManager();
        return SharedObjectManager._instance;
    }

    private getUserSign():string{
        return UM.gameid;
    }

    public setMyValue(key:string,value:any){
        key = this.getUserSign() + "_" + key;
        this.setValue(key,value);
    }

    public getMyValue(key:string):any{
        key = this.getUserSign() + "_" + key;
        return this.getValue(key);
    }

    public removeMyValue(key:string) {

        key = this.getUserSign() + "_" + key;
        egret.localStorage.removeItem(key);
    }

    public setValue(key:string,value:any) {

        var data:any = {};
        data.data = value;
        data = JSON.stringify(data);
        egret.localStorage.setItem(key, data);
    }

    public getValue(key:string):any {
        let value = egret.localStorage.getItem(key);
        if(!value)
            return null;
        var data = JSON.parse(value);
        return data.data;
    }
}
