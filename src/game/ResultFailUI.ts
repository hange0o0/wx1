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
    }
    public childrenCreated() {
        this.addBtnEvent(this.backBtn,this.hide)

    }

    public hide(){
        super.hide();
        GameUI.getInstance().reset();
    }

    public show() {
        super.show();
    }


}