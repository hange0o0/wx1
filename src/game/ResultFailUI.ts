class ResultFailUI extends game.BaseWindow{

    private static _instance:ResultFailUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ResultFailUI();
        return this._instance;
    }

    private rateText: eui.Label;
    private timesText: eui.Label;
    private retryBtn: eui.Button;
    private backBtn: eui.Button;



    public constructor() {
        super();
        this.skinName = "ResultFailUISkin";
        this.canBGClose = false
    }
    public childrenCreated() {
        this.addBtnEvent(this.backBtn,this.hide)
        this.addBtnEvent(this.retryBtn,this.onRetry)

    }

    private onRetry(){
        this.hide();
        GameUI.getInstance().startLevel(GameData.getInstance().level);
    }

    public hide(){
        super.hide();
        GameUI.getInstance().reset();
    }

    public show() {
        super.show();
    }

    public onShow(){
        SoundManager.getInstance().playEffect('die')
        var GD = GameData.getInstance();
        var rate = Math.min(1,GD.passMeter/GD.maxLen);
        this.rateText.text = Math.floor(rate*100)+'%'

        if(CarManager.getInstance().maxLevel < GD.level)
        {
            var failTime = SharedObjectManager.getInstance().getMyValue('chapter'+GD.level) || 0;
            failTime ++;
            SharedObjectManager.getInstance().setMyValue('chapter'+GD.level,failTime);
            this.timesText.text = '已尝试'+failTime+'次'
        }
        else
            this.timesText.text = '';

    }


}