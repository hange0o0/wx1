class TryCarUI extends game.BaseWindow{

    private static _instance:TryCarUI;
    public static getInstance() {
        if (!this._instance) this._instance = new TryCarUI();
        return this._instance;
    }

    private closeBtn: eui.Group;
    private item: SkinItem;
    private btn: eui.Button;



    public currentSkin
    public startLevel
    public shareType
    public videoTimes = 0
    public constructor() {
        super();
        this.skinName = "TryCarUISkin";
        this.canBGClose = false;
    }

    public childrenCreated() {
        this.item.isTry = true
        this.addBtnEvent(this.closeBtn,this.onCancel)
        this.addBtnEvent(this.btn,this.onUse)
    }

    private onCancel(){
        this.hide();
        GameUI.getInstance().startLevel(this.startLevel)
    }

    private onUse(){
        if(this.shareType == 1)
        {
            ShareTool.share('这个游戏很好玩，推荐一下',Config.localResRoot + "share_img_1.jpg",{},()=>{
                this.hide();
                GameUI.getInstance().startLevel(this.startLevel,CarManager.getInstance().skinNum + 1)
            })
        }
        else
        {
            ShareTool.openGDTV(()=>{
                this.videoTimes ++;
                this.hide();
                GameUI.getInstance().startLevel(this.startLevel,CarManager.getInstance().skinNum + 1)
            })
        }
    }

    public show(startLevel?) {
        this.startLevel = startLevel;
        super.show();
    }

    public onShow() {
        this.item.data = CarManager.getInstance().skinNum + 1;
        this.shareType = Math.random()>0.6?2:1
        if(UM.isTest)
            this.shareType = 2;
        else if(this.videoTimes >= 8)
            this.shareType = 1;
        this.btn.label = this.shareType == 1?'免费试用':'观看广告'
    }
}