class SkinItem extends game.BaseItem{

    private bg: eui.Image;

    private desText: eui.Label;
    private rateText: eui.Label;
    private barMC: eui.Image;
    private btn: eui.Button;

    private carMC = new CarMC();

    public constructor() {
        super();
        this.skinName = "SkinItemSkin";
    }

    public childrenCreated() {
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.btn,this.onBuy)
        this.addChildAt(this.carMC,1);
        this.carMC.horizontalCenter = 0;
        this.carMC.y = 8;
        this.carMC.scaleX = this.carMC.scaleY = 0.5;
    }

    private onBuy(e){
        e.stopImmediatePropagation()
    }

    private onClick(){
        if(CarManager.getInstance().skinid == this.data)
            return;
        CarManager.getInstance().setCarSkin(this.data,()=>{

        });
    }

    public dataChanged():void{
         var carVO = GameData.getInstance().carData[this.data];
        this.carMC.setCar(this.data)
        if(true)
        {
            var color = 0x99c5fd;
            this.setUsing(CarManager.getInstance().skinid == this.data);
            this.currentState = 'normal';
            this.setHtml(this.desText, this.createHtml('时速：',color) + carVO.maxSpeed+'KM\n'+
                this.createHtml('加速：',color) + carVO.addSpeed+'KM/秒\n'+
                    this.createHtml('制动：',color) + carVO.decSpeed+'KM/秒');
        }
        else
        {
            this.currentState = 'lock';
            this.rateText.text = ''
            this.barMC.width = 240*1
        }
    }

    public setUsing(b){
        if(!b)
        {
            this.carMC.filters = [];
            return;
        }
        var color:number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
        var alpha:number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX:number = 80;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY:number = 80;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength:number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality:number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner:boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        var knockout:boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter:egret.GlowFilter = new egret.GlowFilter( color, alpha, blurX, blurY,
            strength, quality, inner, knockout );
        this.carMC.filters = [glowFilter];
    }
}