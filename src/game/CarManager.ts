class CarManager {
    private static instance:CarManager;
    public static getInstance():CarManager {
        if (!this.instance)
            this.instance = new CarManager();
        return this.instance;
    }

    public constructor() {

    }

    public maxLevel = _get['level'] || 1;
    public skinid = 1;


    public sendSuccess(fun?){
        var GD = GameData.getInstance();
        SharedObjectManager.getInstance().removeMyValue('chapter'+GD.level)
        this.maxLevel = Math.max(GD.level,this.maxLevel)
        fun && fun();
    }
    public setCarSkin(skinid,fun?){
       this.skinid = skinid;
        EM.dispatch(GameEvent.client.SKIN_CHANGE)
        GameUI.getInstance().renewCar();
        fun && fun();
    }
}