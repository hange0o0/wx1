class SkinUI extends game.BaseWindow{

    private static _instance:SkinUI;
    public static getInstance() {
        if (!this._instance) this._instance = new SkinUI();
        return this._instance;
    }

    private closeBtn: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;

    public constructor() {
        super();
        this.skinName = "SkinUISkin";
    }

    public show() {
        super.show();
    }

    public childrenCreated() {

    }
}