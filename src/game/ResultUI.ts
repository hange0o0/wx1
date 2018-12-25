class ResultUI extends game.BaseWindow{

    private static _instance:ResultUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ResultUI();
        return this._instance;
    }

    private timeText: eui.Label;
    private nextText: eui.Label;
    private shartBtn: eui.Button;
    private nextBtn: eui.Button;
    private backBtn: eui.Group;

    private useTime;
    public constructor() {
        super();
        this.skinName = "ResultUISkin";
        this.canBGClose = false
    }
    public childrenCreated() {
        this.addBtnEvent(this.backBtn,this.hide)
        this.addBtnEvent(this.nextBtn,this.onNext)
        this.addBtnEvent(this.shartBtn,this.onShare)

        this.shartBtn.visible = false;
    }

    private onShare(){

    }
    private onNext(){
        this.hide();
        GameUI.getInstance().startLevel(GameData.getInstance().level + 1);
    }

    public hide(){
        super.hide();
        GameUI.getInstance().reset();
    }

    public show() {
        this.useTime = egret.getTimer() - GameData.getInstance().startTime;
        CarManager.getInstance().sendSuccess(this.useTime,()=>{
            super.show();
        })
    }

    public onShow(){
        SoundManager.getInstance().playEffect('win')
        var GD =  GameData.getInstance();
        var star =  GD.getStarByLevel(GD.level,this.useTime)
        for(var j=0;j<3;j++)
        {
            this['s'+j].source = star>j?'chapter_star2_png':'chapter_star1_png'
        }
        this.nextText.visible = GD.level == CarManager.getInstance().maxLevel;

        this.nextBtn.visible = GD.level != GameData.MaxLevel

        var cd = this.useTime;
        var cd2 =  Math.floor((cd%1000)/10)
        cd = Math.floor(cd/1000)
        this.timeText.text = DateUtil.getStringBySecond(cd).substr(-5) + '.' + ('00' + cd2).substr(-2)
    }


}