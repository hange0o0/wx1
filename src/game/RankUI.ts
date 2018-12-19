class RankUI extends game.BaseWindow{

    private static _instance:RankUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RankUI();
        return this._instance;
    }

    private closeBtn: eui.Group;

    private bitmap: egret.Bitmap;
    private isdisplay = false;

    private isSendConfig:boolean;
    private isLoadFile:boolean;


    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)
        this.touchEnabled = false;

    }
    public onShow(){
        if(!window['wx'])
            return;
        this.showBitmapList();
    }

    private poseData(){
        let param:any = {
            me: UM.gameid,
            command: 'open',
            x:this.bitmap.x + (GameManager.uiWidth - this.width)/2,
            y:this.bitmap.y + (GameManager.uiHeight - this.height)/2,
            me_value: CarManager.getInstance().getAllStar() + ',0', //第2位时间传0，永远排在最上面
            root: "openDataContext/",
        }
        //传递 静态配置数据到 开放域
        //if(this.isdisplay && !this.isSendConfig){
        //    //param.q_fruit = CMFR.q_fruit.data;
        //
        //    this.isSendConfig = true;
        //}

        //发送消息
        var platform = window['platform']
        platform.openDataContext.postMessage(param);
    }

    //0 好友榜，2群排行
    public showBitmapList(){
        if(!window["wx"] || !window["wx"].getOpenDataContext) return;
        this.remove();
        var platform = window['platform']
        if (!this.isdisplay) {

            this.bitmap = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
            this.bitmap.x = 20;
            this.bitmap.y = 110;
            this.addChild(this.bitmap);
            this.bitmap.touchEnabled = false

            this.isdisplay = true;
            this.poseData();
        }
    }

    protected remove(){
        var platform = window['platform']
        if(this.isdisplay){
            this.isdisplay = false;
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);

            if(platform.openDataContext){
                platform.openDataContext.postMessage({ command: 'close' });
            }
        }
    }
    public hide(){
        this.remove();
        super.hide();
    }
}