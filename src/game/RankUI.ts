class RankUI extends game.BaseWindow{

    private static _instance:RankUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RankUI();
        return this._instance;
    }

    private closeBtn: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;


    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public show() {
        super.show();
    }

    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.hide)
    }

    private test(){

    }
}