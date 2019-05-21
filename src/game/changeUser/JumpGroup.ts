class JumpGroup extends game.BaseContainer {
    private static _instance:JumpGroup;
    public static getInstance() {
        if (!this._instance) this._instance = new JumpGroup();
        return this._instance;
    }


    private goBtn: eui.Button;
    private talkText: eui.Label;



    private randomNum = 0.5
    public constructor() {
        super();
        this.skinName = "JumpGroupSkin";
        this.bottom = 0;
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,()=>{
            var wx = window['wx'];
            if(!wx)
            {
                MyWindow.ShowTips('只在公网生效')
                return;
            }
            wx.navigateToMiniProgram({
                appId: 'wxe066524f2972cb1a',
                success(res) {
                    // 打开成功
                }
            })
        })
    }

    public show(str){
        if(Math.random()> this.randomNum)
            return;
        this.randomNum *= 0.8;
        GameManager.container.addChild(this);
        this.talkText.text = str;
        this.bottom = Config.adHeight;
    }

    public hide(){
        MyTool.removeMC(this)
    }
}