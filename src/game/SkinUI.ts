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


        this.validateNow();
        var max = this.scroller.viewport.contentHeight-this.scroller.height;
        var v = Math.min(max,Math.floor(CarManager.getInstance().skinNum/3)*(260+15));
        egret.Tween.get(this.scroller.viewport).to({scrollV:v},100)

        //setTimeout(()=>{
        //    console.log(v,this.scroller.viewport.scrollV);
        //},100)
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