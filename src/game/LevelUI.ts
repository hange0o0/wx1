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

    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.hide)
        this.scroller.viewport = this.list;
        this.list.itemRenderer = LevelItem;
    }


    public show() {
        super.show();
    }

    public onShow(){
        var arr = [];
        for(var i=0;i<GameData.MaxLevel;i++)
            arr.push(i+1)
        this.list.dataProvider = new eui.ArrayCollection(arr)

        this.validateNow();
        var max = this.scroller.viewport.contentHeight-this.scroller.height;
        var v = Math.min(max,Math.floor(CarManager.getInstance().maxLevel/4)*(145+15));
        egret.Tween.get(this.scroller.viewport).to({scrollV:v},100)
    }
}