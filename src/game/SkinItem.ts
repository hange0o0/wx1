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
        if(this.btn.label == '解锁')
        {
            CarManager.getInstance().buySkin(this.data,()=>{

            });
            return;
        }
        var carVO = GameData.getInstance().carData[this.data];
        switch(carVO.buyType)
        {
            case 0://默认
                break
            case 1:
                SkinUI.getInstance().hide();
                GameUI.getInstance().onStart()
                break;
            case 2:
                break;
            case 3:
                console.log(UM.gameid);
                ShareTool.share('集赞换新车，就差你了',Config.localResRoot + "share_img_1.jpg",{type:1,from:UM.gameid,skinid:this.data})
                //this.rateText.text = '邀请'+max+'个新用户'
                break;
            case 4:
                //this.rateText.text = '观看广告'+max+'次'
                //this.btn.label = '观看'
                break;
        }

    }

    private onClick(){
        if(CarManager.getInstance().skinid == this.data)
            return;
        if(!CarManager.getInstance().isHaveSkin(this.data))
            return;
        CarManager.getInstance().setCarSkin(this.data,()=>{

        });
    }

    private onTimer(){
         if(this.currentState == 'lock' && GameData.getInstance().carData[this.data].buyType == 2)
            this.dataChanged();
    }

    public dataChanged():void{
        var openNum = CarManager.getInstance().skins.length;
        if(this.data > openNum + 1)
        {
            this.currentState = 'lock2';
            this.carMC.visible = false
            this.cacheAsBitmap = false;
            return;
        }

        var carVO = GameData.getInstance().carData[this.data];
        this.carMC.visible = true
        this.carMC.setCar(this.data)
        if(CarManager.getInstance().isHaveSkin(this.data))
        {
            var color = 0x99c5fd;
            this.setUsing(CarManager.getInstance().skinid == this.data);
            this.currentState = 'normal';
            this.setHtml(this.desText, this.createHtml('时速：',color) + carVO.maxSpeed+'KM\n'+
                this.createHtml('加速：',color) + carVO.addSpeed+'KM\n'+
                    this.createHtml('制动：',color) + carVO.decSpeed+'KM');
        }
        else
        {
            this.cacheAsBitmap = false;
            this.currentState = 'lock';
            var v = CarManager.getInstance().getSkinValue(this.data)
            var max = carVO.buyValue;
            this.btn.visible = true;
            switch(carVO.buyType)
            {
                case 0://默认
                    break
                case 1:
                    this.rateText.text = '完成第'+max+'关'
                    this.btn.label = '前往'
                    break
                case 2:
                    this.rateText.text = max + '小时后获得'
                    this.btn.visible = false;
                    break
                case 3:
                    this.rateText.text = '邀请'+max+'个新用户'
                    this.btn.label = '邀请'
                    break
                case 4:
                    this.rateText.text = '观看广告'+max+'次'
                    this.btn.label = '观看'
                    break
            }
            this.barMC.width = 240*Math.min(v/max,1)
            if(v>=max)
            {
                this.btn.label = '解锁'
                this.btn.visible = true;
            }
        }
    }

    public setUsing(b){
        //return;
        if(!b)
        {
            this.carMC.filters = [];
            this.cacheAsBitmap = false;
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
        //this.cacheAsBitmap = true;
    }
}