class CarManager {
    private static instance:CarManager;
    public static getInstance():CarManager {
        if (!this.instance)
            this.instance = new CarManager();
        return this.instance;
    }

    public constructor() {
        this.maxLevel = ObjectUtil.objLength(this.levelData)
        //this.maxLevel = 999
    }
    public shareNum = 0;


    public isGuide = !SharedObjectManager.getInstance().getMyValue('finishGuide')
    public maxLevel = _get['level'] || 0;
    public skinid = 1;
    public levelData = {1:20000,2:20000,3:20000,4:20000,5:20000,6:20000}
    public skinNum =1;
    public skinsData:any = {};

    public initData(data){
        this.skinid = data.skinid;
        this.levelData = data.levelData;
        this.skinNum = data.skinNum;
        this.skinsData = data.skinsData || {};
        this.maxLevel = ObjectUtil.objLength(this.levelData)

        //
        //this.skinNum = 2;
    }

    public getLevelStar(level){
        var cd = this.getLevelCD(level);
        if(cd)
            return GameData.getInstance().getStarByLevel(level,cd)
        return 0;
    }

    public getAllStar(){
        var star = 0;
        for(var s in this.levelData)
        {
            star += this.getLevelStar(s);
        }
        return star;
    }

    public getLevelCD(level){
        return this.levelData[level] || 0
    }

    public isHaveSkin(skinid){
         return this.skinNum >= skinid;
    }

    public getSkinValue(skinid){
        var carVO = GameData.getInstance().carData[skinid];
        switch(carVO.buyType)
        {
            case 0://默认
                break
            case 1:
                //this.rateText.text = '完成第'+max+'关'
                return this.maxLevel
            case 2:
                //this.rateText.text = max + '小时后获得'
                return (TM.now() - (this.skinsData.time || 0))/3600
            case 3:
                //this.rateText.text = '邀请'+max+'个新用户'
                return ObjectUtil.objLength(this.skinsData[skinid] || {});
            case 4:
                //this.rateText.text = '观看广告'+max+'次'
                return this.skinsData[skinid] || 0;
            case 5:
                //this.rateText.text = '观看广告'+max+'次'
                return this.getAllStar();;
            case 6:
                //this.rateText.text = '观看广告'+max+'次'
                return this.shareNum;
            case 7:
                //this.rateText.text = '观看广告'+max+'次'
                return this.skinsData[skinid]?Number.MAX_VALUE: 0;
        }
         return 0;
    }

    public sendSuccess(useTime,fun?){
        var GD = GameData.getInstance();
        var lastCD = this.getLevelCD(GD.level);
        SharedObjectManager.getInstance().removeMyValue('chapter'+GD.level)
         this.upWXData();
        if(!lastCD || useTime < lastCD)
        {
            //var newLevelData = ObjectUtil.clone(this.levelData)
            var newLevelData = {};
            newLevelData[GD.level] = useTime;

            var lastStar = this.getAllStar();
            WXDB.updata('user',{levelData:newLevelData},()=>{

                //fun && fun();
            })
            this.levelData[GD.level] = useTime;
            this.maxLevel = ObjectUtil.objLength(this.levelData)
            if(lastStar != this.getAllStar())
                this.upWXData();
        }
        fun && fun();
    }

    public setCarSkin(skinid,fun?){
        this.skinid = skinid;
        GameUI.getInstance().renewCar();
        WXDB.updata('user',{skinid:skinid},()=>{
            fun && fun();
        })
    }

    public buySkin(skinid,fun?){
        //var newSkins = this.skins.concat(skinid);
        var t = TM.now();
        WXDB.updata('user',{skinNum:this.skinNum+1,skinsData:{time:t}},()=>{
            this.skinNum ++;
            this.skinsData.time = t
            EM.dispatch(GameEvent.client.SKIN_CHANGE)
            fun && fun();
        })
    }
    public onVideo(skinid,fun?){
        //var newSkins = this.skins.concat(skinid);
        var t = TM.now();
        var oo = {skinsData:{}}
        this.skinsData[skinid] = (this.skinsData[skinid] || 0) + 1
        oo.skinsData[skinid] = this.skinsData[skinid];
        WXDB.updata('user',oo,()=>{
            EM.dispatch(GameEvent.client.SKIN_CHANGE)
            fun && fun();
        })
    }


    public upWXData(){
        var wx = window['wx'];
        if(!wx)
            return;
        wx.setUserCloudStorage({
            KVDataList: [{ key: 'score', value: this.getAllStar() + ',' + TM.now()}],
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            }
        });
    }



    private extraData
    private finishExtraUin
    public initExtra(data){
        this.extraData = null;
        if(!data || !data.referrerInfo || !data.referrerInfo.extraData || !data.referrerInfo.extraData.appid)
        {
            return;
        }
        if(this.finishExtraUin != data.referrerInfo.extraData.uin)
            this.extraData = data.referrerInfo.extraData
    }

    //前往WX5
    public openWX5(data){
        var wx = window['wx'];
        data.appid = Config.myAppID//我的APPID
        data.uin = Math.floor(Math.random()*1000000000000000);//唯一Key
        if(!wx)
        {
            this.extraData = data
            this.testWX5Back()
            return;
        }

        wx.navigateToMiniProgram({
            appId: 'wxe2875716299fa092',//别点小广告
            envVersion:'trial',
            extraData:data,
            complete(res) {
            }
        })
    }

    //WX5回调
    public testWX5Back(){
        if(!this.extraData)
            return
        this.finishExtraUin = this.extraData.uin;
        switch(this.extraData.callBack)
        {
            case 'unlockSkin':
               this.onVideo(this.extraData.skinid)
                break;
        }
    }
}