class CarManager {
    private static instance:CarManager;
    public static getInstance():CarManager {
        if (!this.instance)
            this.instance = new CarManager();
        return this.instance;
    }

    public constructor() {
        this.maxLevel = ObjectUtil.objLength(this.levelData)
    }

    public maxLevel = _get['level'] || 0;
    public skinid = 1;
    public data
    public levelData = {1:20000}
    public skins = [1,2]
    public skinsData:any = {};

    public getLevelStar(level){
        var cd = this.getLevelCD(level);
        if(cd)
            return GameData.getInstance().getStarByLevel(level,cd)
        return 0;
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
                return TM.now() - (this.skinsData.time || 0)/3600
            case 3:
                //this.rateText.text = '邀请'+max+'个新用户'
                return this.skinsData[skinid] || 0;
            case 4:
                //this.rateText.text = '观看广告'+max+'次'
                return this.skinsData[skinid] || 0;
        }
         return 0;
    }

    public sendSuccess(useTime,fun?){
        var GD = GameData.getInstance();
        var lastCD = this.getLevelCD(GD.level);
        if(lastCD)
            this.levelData[GD.level] = Math.min(useTime,lastCD);
        else
            this.levelData[GD.level] = useTime;

        SharedObjectManager.getInstance().removeMyValue('chapter'+GD.level)
        this.maxLevel = ObjectUtil.objLength(this.levelData)
        fun && fun();
    }

    public setCarSkin(skinid,fun?){
       this.skinid = skinid;
        EM.dispatch(GameEvent.client.SKIN_CHANGE)
        GameUI.getInstance().renewCar();
        fun && fun();
    }

    public buySkin(skinid,fun?){
       this.skins.push(skinid);
        EM.dispatch(GameEvent.client.SKIN_CHANGE)
        fun && fun();
    }
}