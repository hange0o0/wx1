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

    public isGuide = !SharedObjectManager.getInstance().getMyValue('finishGuide')
    public maxLevel = _get['level'] || 0;
    public skinid = 1;
    public levelData = {1:20000,2:20000,3:20000,4:20000,5:20000,6:20000}
    public skins = [1,2,3,4,5,6,7,8,9,10,11]
    public skinsData:any = {};

    public initData(data){
        this.skinid = data.skinid;
        this.levelData = data.levelData;
        this.skins = data.skins;
        this.skinsData = data.skinsData || {};
        this.maxLevel = ObjectUtil.objLength(this.levelData)

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
         return this.skins.indexOf(skinid) != -1;
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
                this.levelData[GD.level] = useTime;
                this.maxLevel = ObjectUtil.objLength(this.levelData)
                if(lastStar != this.getAllStar())
                    this.upWXData();
                fun && fun();
            })
            return;
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
        var newSkins = this.skins.concat(skinid);
        var t = TM.now();
        WXDB.updata('user',{skins:newSkins,skinsData:{time:t}},()=>{
            this.skins.push(skinid);
            this.skinsData.time = t
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
}