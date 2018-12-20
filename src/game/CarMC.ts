class CarMC extends eui.Group{

    private static pool = [];

    public static createItem():CarMC {
        var item:CarMC = this.pool.pop();
        if (!item) {
            item = new CarMC();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        this.pool.push(item);
    }

    public speed;
    private mc:eui.Image;
    public constructor() {
        super();
        this.mc = new eui.Image('car_png');
        this.addChild(this.mc);
        this.mc.x = this.mc.y = 0;
        this.width = 238
        this.height = 320
    }

    public remove(){
        MyTool.removeMC(this);
        this.cacheAsBitmap = false;
    }

    public setCar(skinid):void{
        var index = GameData.getInstance().carData[skinid].artid;
        var w = this.width
        var h = this.height
        var x = (index-1)%4
        var y = Math.floor((index-1)/4)
        this.mc.scrollRect = new egret.Rectangle(x*w,y*h,w,h)
    }
}
