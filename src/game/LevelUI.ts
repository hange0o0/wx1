class LevelUI extends game.BaseWindow{

    private static _instance:LevelUI;
    public static getInstance() {
        if (!this._instance) this._instance = new LevelUI();
        return this._instance;
    }

    private closeBtn: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;


    public constructor() {
        super();
        this.skinName = "LevelUISkin";
    }

    public show() {
        super.show();
    }

    public childrenCreated() {

    }
}