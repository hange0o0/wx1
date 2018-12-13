class DebugUI extends game.BaseUI {

    private static _instance:DebugUI;

    public static getInstance() {
        if (!this._instance) this._instance = new DebugUI();
        return this._instance;
    }

    private backBtn: eui.Button;
    private con: eui.Group;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)
        var wx = window['wx'];
        if(!wx)
            return;

        this.addB('数据库',()=>{
            const db = wx.cloud.database()
        })
    }

    private addB(label,fun){
       var btn = new eui.Button();
        btn.skinName = 'Btn1Skin'
        this.con.addChild(btn);
        this.addBtnEvent(btn,fun);
    }

}