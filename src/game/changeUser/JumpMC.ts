class JumpMC extends game.BaseItem{

    public static adList = []
    public static getAD(fun?){
        var wx = window['wx'];
        if(!wx)
            return;
        if(this.adList.length)
        {
            fun && fun();
            return;
        }
        this.adList.length = 0;
        wx.wladGetAds(10,function (res) { //第⼀一个参数为获取⼴广告条数，第⼆二个参数为获取成功后回调⽅方法;
            JumpMC.adList = res.data;
            ArrayUtil.random(JumpMC.adList)
            fun && fun();
        })
    }

    //"appid": "wxec9471079f8b6c27",
    //"desc": “免费抽⼤大奖，免费领奖品，再奖⼀一个亿！",
    //"img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wxec9471079f8b6c27/75428.jpg",
    //"logo": "https://wllm.oss-cn-beijing.aliyuncs.com/logoa/wxec9471079f8b6c27.png",
    //"name": "测试号1"


    private mc: eui.Image;

    public constructor() {
        super();
        this.skinName = "JumpMCSkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        //this.visible = false;
        this.addBtnEvent(this,this.onClick)
        this.show();
        //this.addEventListener(egret.Event.ADDED_TO_STAGE,this.show,this);
    }


    private onClick(){
        var wx = window['wx'];
        wx.previewImage({
            urls: [this.data.img],
            success: function () {
            }
        })
    }

    public dataChanged():void {
        this.mc.source = this.data.logo;
    }

    public show(){
        //if(JumpMC.adList.length == 0)
        //{
        //    MyTool.removeMC(this);
        //    return;
        //}
        JumpMC.getAD(()=>{
            this.data = JumpMC.adList.shift();
            JumpMC.adList.push(this.data);
        })
        //this.visible = true;

    }


}