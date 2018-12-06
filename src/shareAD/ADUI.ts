
//界面显示 Banner广告
class DebugWXGameAD {

    private con:eui.Rect = new eui.Rect();

    public createBannerAd(btnx,btny,btnw){
        this.con.x = btnx;
        this.con.y = btny;
        this.con.width = btnw;
        this.con.height = btnw * 0.35;
    }

    public hide(){
        MyTool.removeMC(this.con);
    }

    public show():void{
        GameManager.stage.addChild(this.con);
	}

    public destroy(){
        this.hide();
    }

    public offLoad(){}
    public offError(){}

    public setY(btny:number){
        this.con.y = btny;
        //WXAddCode.execute();
    }

}

//界面显示 Banner广告
class ADUI {

    private static adids = {
                    // 1:"adunit-1ea5e028c0953495", //"其他"
                    // 4:"adunit-02a48e435f3739fb",//"任务界面"
                    // 5:"adunit-9651e554bc7c5941",//"设置界面"
                    // 6:"adunit-e4180f0c0e87bf55",//"商店界面"
                    // 7:"adunit-147b5a961ae6325c",//排行榜界面
                    // 8:"adunit-608b7a67aa1e5869",//离线界面
                    // 9:"adunit-d88047b52446f4cb",//"等级礼包界面"
                    // 10:"",//"雇佣好友"
                };
    public static getADID(adindex):string{
        return this.adids[adindex];
    }

    public static wx_banner_openids
    public static wx_bannerCode
    public static wx_refushAD_time

    private parentUI:any;//广告父界面，不一定是this.parent 而是包广告对象的 BaseUI界面，用于判断当其他界面显示隐藏时影响 当前广告的显示状态
    private style:any;
    private adid:string;
    private initTime:number;
    private adindex:number;

    private static bannerAd:any;
    private bannerAdBg:DebugWXGameAD;
    private autoChange:boolean;
    //private changeTimer:number;

    private isUI:boolean;

    public static get isEnabled(){
        if(DEBUG)
            return _get["showAD"];

        if(!window["wx"] || !window["wx"].createBannerAd){
            DEBUG && console.log("当前版本不支持广告");
            return false;
        }
        return true; 
    }

    public get isEnabled(){
        if(!ADUI.isEnabled) return false;
        try{
            let list = ADUI.wx_banner_openids;
            if(list && this.adindex){
                return list.indexOf(this.adindex) >= 0;
            }
        }catch(e){
        }
        return true; 
    }

    private get availWidth(){
        return screen.availWidth;
    }
    private get availHeight(){
        return screen.availHeight;
    }

    public getDefault(adindex:number, btnw:number = 540):any{
        this.adindex = adindex;
        var adid = this.adid = ADUI.adids[adindex] || ADUI.wx_bannerCode;
        let scalex = this.availWidth/640;
        if(btnw * scalex < 300){ //微信限制广告宽度不能小于300
            btnw = 300 / scalex;
        }
        let btny = GameManager.uiHeight - (btnw/640 * 224);//给广告留的高度
        return {id:adid, btnw:btnw, btnx:(640-btnw)/2, btny:btny};
    }

    public addBannerBg(){
        this.bannerAdBg = new DebugWXGameAD();
    }

    public initSameAD(adindex:number, parentUI:any, btny?:number){
        this.adindex = adindex;
        this.parentUI = parentUI;

        //弹窗界面，广告位于弹窗下方
        if(ADUI.bannerAd && btny != undefined){
            if(DEBUG){
                ADUI.bannerAd.setY(btny);
                return;
            }
            let scaley = screen.availHeight/GameManager.stage.stageHeight;
            ADUI.bannerAd.style.top = scaley * btny;
        }
    }

    //初始广告id、坐标位置 （特别注意 btny 需要兼容 普通手机和 iphoneX手机）
    public init(parentUI:any, arg:{id:string, btnw:number, btnx:number, btny:number, autoChange?:boolean, isUI?:boolean}){

        if(!this.isEnabled) return;

        this.parentUI = parentUI;

        //这里存在界面坐标、尺寸换算关系 width="180" height="60" bottom="40" x="230"
        // let btnw = 640, btnh = 60, btnx = 0, btny = 276;
        let btnw = arg.btnw, btnx = arg.btnx, btny = arg.btny;
        let scalex = this.availWidth/640;
        let scaley = this.availHeight/GameManager.stage.stageHeight;
        let left = scalex * (btnx);
        let top = scaley * (btny);// + (AppQU.isIphoneX ? 52 : 0));
        let width = scalex * btnw;
        // let height = scalex * btnh;

        this.style = {
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: Math.floor(width)
                }
        if(!ADUI.bannerAd){
            this.createAD(arg.id, left, top, width);
        }
        this.autoChange = arg.autoChange;
        this.isUI = arg.isUI;
    }
    
    private startChange(){
        //if(this.autoChange){ //是否在当前页面开启定时自动刷新的机制
        //    egret.clearTimeout(this.changeTimer);
        //    this.changeTimer = egret.setTimeout(()=>{
        //        EventManagerQU.removeEvent(ServerQueenEvent.Client.SHOWWINDOW,this.checkShow,this);
        //        EventManagerQU.removeEvent(ServerQueenEvent.Client.HIDEWINDOW,this.checkHide,this);
        //        this.show(true);
        //    }, this, (ConfigQU.appData && ConfigQU.appData.wx_refushAD_time || 30) * 1000);
        //}
        //WXAddCode.execute();
    }

    public hide(){
        //EventManagerQU.removeEvent(ServerQueenEvent.Client.SHOWWINDOW,this.checkShow,this);
        //EventManagerQU.removeEvent(ServerQueenEvent.Client.HIDEWINDOW,this.checkHide,this);
        //egret.clearTimeout(this.changeTimer);

        // console.log("隐藏广告");
        if(!ADUI.bannerAd) return;

        this.bannerAdBg && this.bannerAdBg.hide();
        if(ADUI.bannerAd.now != this.parentUI) return;
        try{
            ADUI.bannerAd.hide();
        }catch(e){
            console.log("error:",e);
        }
    }

    private createAD(id, left, top, width){
        let scalex = this.availWidth/640;
        let scaley = this.availHeight/GameManager.stage.stageHeight;
        if(DEBUG){
            ADUI.bannerAd = new DebugWXGameAD();
            ADUI.bannerAd.createBannerAd(left/scalex, top/scaley, width/scalex);
            return;
        }
        if(this.bannerAdBg){
            this.bannerAdBg.createBannerAd(left/scalex, top/scaley, width/scalex);
        }
        ADUI.bannerAd = window["wx"].createBannerAd({
            adUnitId: id,
                style: {
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: Math.ceil(width)
                }
            })
        this.initTime = Date.now();
    }

	public show(refush:boolean=false):void{
        if(!this.isEnabled) return;

        //EventManagerQU.addEvent(ServerQueenEvent.Client.SHOWWINDOW,this.checkShow,this);
        //EventManagerQU.addEvent(ServerQueenEvent.Client.HIDEWINDOW,this.checkHide,this);

        if(refush || (this.initTime && Date.now() - this.initTime > (ADUI.wx_refushAD_time || 30) * 1000)){
            this.destroy();
            this.createAD(this.adid, this.style.left, this.style.top, this.style.width);
        }

        // console.log("显示广告");
        if(!ADUI.bannerAd) return;

        ADUI.bannerAd.show();
        this.bannerAdBg && this.bannerAdBg.show();
        this.startChange();

        ADUI.bannerAd.now = this.parentUI;
        if(this.isUI){
            if(DEBUG){
                let scaley = screen.availHeight/GameManager.stage.stageHeight;
            this.bannerAdBg && this.bannerAdBg.setY(this.style.top/scaley);
                ADUI.bannerAd.setY(this.style.top/scaley);
                return;
            }
            ADUI.bannerAd.style.top = this.style.top;
        }
	}

    public destroy(){
        // console.log("销毁广告");
        if(!ADUI.bannerAd) return;
        try{//会报没有destroy方法，故加try catch
            ADUI.bannerAd.destroy();
        }catch(e){
            console.log("error2:",e);
            //WXAddCode.execute();
        }
        ADUI.bannerAd = null;
        this.bannerAdBg && this.bannerAdBg.destroy();
    }

	private checkShow(e:egret.Event):void{
        let current = e.data;
        if(current === true || current != this.parentUI){
            // console.log("临时隐藏广告");
            //egret.clearTimeout(this.changeTimer);
            if(!ADUI.bannerAd) return;
            if(ADUI.bannerAd.now != this.parentUI) return;
            try{
            ADUI.bannerAd.hide();
            }catch(e){}
            this.bannerAdBg && this.bannerAdBg.hide();
        }
	}

	private checkHide(e:egret.Event):void{
        if(!this.parentUI) return;
        let parent = <egret.DisplayObjectContainer>this.parentUI.parent;
        if(this.parentUI.stage && parent.getChildIndex(this.parentUI) == parent.numChildren - 1){
            // console.log("临时显示广告");
            if(!ADUI.bannerAd) return;
            ADUI.bannerAd.show();
            this.bannerAdBg && this.bannerAdBg.show();
            if(ADUI.bannerAd.now != this.parentUI){
                ADUI.bannerAd.now = this.parentUI;
            }

            if(this.isUI){
                this.show();
            }
        }
	}

}