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

    public constructor() {
        super();
        this.skinName = "ResultUISkin";
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