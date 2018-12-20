class SkinUI extends game.BaseWindow{

    private static _instance:SkinUI;
    public static getInstance() {
        if (!this._instance) this._instance = new SkinUI();
        return this._instance;
    }

    private closeBtn: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;


    public currentSkin
    public constructor() {
        super();
        this.skinName = "SkinUISkin";
    }

    public childrenCreated() {
        this.addBtnEvent(this.closeBtn,this.hide)
        this.scroller.viewport = this.list;
        this.list.itemRenderer = SkinItem;
    }

    public show() {
        super.show();
    }

    public onShow(){
        this.currentSkin = CarManager.getInstance().skinid;
        this.addPanelOpenEvent(GameEvent.client.SKIN_CHANGE,this.renewList)
        //this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        var arr = [];
        for(var i=0;i<GameData.MaxCar;i++)
            arr.push(i+1)
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }

    private renewList(){
        MyTool.renewList(this.list)
    }

    private onTimer(){
        MyTool.runListFun(this.list,'onTimer')
    }

    public hide(){

        super.hide();
        if(this.currentSkin != CarManager.getInstance().skinid)
        {
            CarManager.getInstance().setCarSkin(this.currentSkin,()=>{

            });
        }

    }
}