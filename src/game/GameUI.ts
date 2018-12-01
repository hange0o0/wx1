class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    private bg: eui.Image;
    private errorMC: eui.Group;
    private errorText: eui.Label;
    private line2: eui.Image;
    private line1: eui.Image;
    private treeGroup: eui.Group;
    private titleMC: eui.Image;
    private startBtn: eui.Image;
    private rankBtn: eui.Image;
    private levelBtn: eui.Image;
    private skinBtn: eui.Image;
    private settingBtn: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private slowBtn: eui.Image;
    private speedBtn: eui.Image;
    private readyText: eui.Label;
    private speedText: eui.Label;
    private needle: eui.Image;
    private limitGroup: eui.Group;
    private rateMC2: eui.Rect;






    private timer = new egret.Timer(1000/GameData.Frame);
    private carMC;
    private alarm = false

    private speedState = 0;
    private treeArr1 = [];
    private treeArr2 = [];
    private treePool = [];
    private carArr = [];
    private road = {
        1:{pos:-75},
        2:{pos:-230},
        3:{pos:230},
    }
    //private road = [-75,-230,230];

    private lastCreateCarTime = 0;
    private gameState = 0;
    private carIndex = 5;

    private touchID = {}
    private addSpeedTimes
    private decSpeedTimes

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    public show() {
        super.show();
    }

    public childrenCreated() {
        super.childrenCreated();
        //this.list.itemRenderer = InviteItem2;
        //this.slowBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on,this);
        //this.speedBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onSpeed,this);

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove,this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd,this);



        this.addBtnEvent(this.rankBtn, this.onRank);
        this.addBtnEvent(this.levelBtn, this.onLevel);
        this.addBtnEvent(this.skinBtn, this.onSkin);
        this.addBtnEvent(this.settingBtn, this.onSetting);

        this.addBtnEvent(this.startBtn, this.onStart);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onE,this)

        this.carMC = new CarMC();
        this.carMC.setCar(1)
        this.addChildAt(this.carMC,this.carIndex);
        this.carMC.scaleX = this.carMC.scaleY = 0.7;
        this.carMC.horizontalCenter = 75
        this.carMC.bottom = 350;

    }

    private onTouchBegin(e){
        this.touchID[e.touchPointID] = {
            x:e.stageX,
            y:e.stageY,
        }
        //console.log('begin',e.touchPointID)
    }
    private onTouchMove(e){
        //console.log('move',e.touchPointID)
        this.touchID[e.touchPointID] = {
            x:e.stageX,
            y:e.stageY,
        }
    }

    private onTouchEnd(e){
        //console.log('end',e.touchPointID)
        delete this.touchID[e.touchPointID];
    }

    private onRank(){
         RankUI.getInstance().show();
    }

    private onLevel(){
        LevelUI.getInstance().show();
    }

    private onSkin(){
        SkinUI.getInstance().show();
    }

    private onSetting(){

    }






    private onSlow(){
        this.speedState = -1;
    }

    private onSpeed(){
        this.speedState = 1;
    }

    private onStart(){
        GameData.getInstance().setCar(1)
        GameData.getInstance().onGameStart(CarManager.getInstance().maxLevel + 1)
        this.resetRed();
        this.speedState = 0;
        this.currentState = 'game'

        this.limitGroup.visible = false;

    }

    public onShow(){
        this.timer.start()
        this.reset();
    }

    public reset(){
        this.currentState = 'main'
        this.line1.bottom = 0;
        this.line2.bottom = 0;
        this.bg.bottom = 0;
        this.errorMC.visible = false;
        this.levelText.text = '挑点关卡：' + (CarManager.getInstance().maxLevel + 1);


        for(var s in this.road) {
            var car = this.road[s].car;
            if (car) {
                CarMC.freeItem(car);
                this.road[s].car = null;
            }
        }
    }


    private onE(){
        var GD = GameData.getInstance();
         if(!GD.isPlaying)
         {

             if(this.gameState)
             {
                 this.errorMC.visible = false;
                 var targetSpeed = this.gameState == 2?0:GD.baseSpeed;
                 if(GD.speed > targetSpeed)
                 {
                     GD.decSpeed();
                 }
                 this.speedText.text = Math.floor(GD.speed) + ''
                 this.onMoveBG(GD.speed);
                 this.onOtherCarMove();
             }
             else
                this.onMoveBG(GD.baseSpeed);
             return;
         }

        if(this.speedState == -1)
            GD.decSpeed()
        else if(this.speedState == 1)
            GD.addSpeed()

        var speed = GD.speed;
        this.onMoveBG(speed);
        GD.onRunSpeed();
        var rate = Math.min(1,GD.passMeter/GD.maxLen);
        //this.rateMC.width = 260 *rate;

        var cd = (GD.maxTime + GD.startTime - egret.getTimer());
        if(cd < 0)
        {
            GD.isPlaying = false
            this.gameState = 2;
            ResultFailUI.getInstance().show();
            return;
        }
        else if(rate >= 1)
        {
            console.log(GD.passMeter,GD.maxLen)
            GD.isPlaying = false
            this.gameState = 1;
            ResultUI.getInstance().show();
            return;
        }
        var cd2 =  Math.floor((cd%1000)/10)
        cd = Math.floor(cd/1000)
        //this.cdText.text = DateUtil.getStringBySecond(cd).substr(-5) + '.' + ('00' + cd2).substr(-2)

        this.speedText.text = Math.floor(GD.speed) + ''

         this.onOtherCarMove();

        if(this.errorMC.visible)
        {
            var oo = GD.redArr[0];
            var meter = oo.start - GD.passMeter //离红色的距离
             this.errorMC.bottom = this.carMC.bottom + this.carMC.height +  GD.meterToPix(meter)
            if(!this.alarm && meter <= GameData.AlertMeter && meter> 30)
            {
                this.alarm = true;
                this.limitGroup.visible = true;

            }

            if(this.alarm && meter <= 0)
            {
                this.alarm = false;
            }
            this.limitGroup.visible = meter >=oo.len;

            if(meter <=0 && meter >= -oo.len)//红块内
            {
                if(GD.speed > oo.speed)//超速
                {
                    GD.isPlaying = false
                    this.gameState = 2;
                    ResultFailUI.getInstance().show();
                    return;
                }
            }
            else if(this.errorMC.bottom < -this.errorMC.height)
            {
                GD.redArr.shift();
                this.resetRed();
            }

            if(this.limitGroup.visible)
            {
                this.rateMC2.width = 200* (GameData.AlertMeter - meter)/GameData.AlertMeter
                //this.speedText2.textColor = GD.speed > oo.speed?0xFF0000:0x00ff00;
                //this.speedText2.text = Math.floor(GD.speed) + '/' + oo.speed;

                if(meter > 0)
                {
                    //console.log(meter,(GD.speed*1000/3600))
                    cd = meter / (GD.speed*1000/3600)
                    cd2 =  Math.floor(cd*100)%100
                    cd = Math.floor(cd)
                    //this.cdText2.text = DateUtil.getStringBySecond(cd).substr(-5) + '.' + ('00' + cd2).substr(-2)
                }
                else
                {
                    //this.cdText2.text = ''
                }

            }
        }

    }

    private resetRed(){
        var GD = GameData.getInstance();
        var oo = GD.redArr[0];
        if(!oo)
        {
            this.errorMC.visible = false;
            return;
        }
        this.errorMC.visible = true;
        this.errorMC.height =  GD.meterToPix(oo.len);
        this.errorText.text = oo.speed;
    }

    private onOtherCarMove(){
        var emptyPos = [];
        for(var s in this.road)
        {
            var car:CarMC = this.road[s].car;
            if(car)
            {
                var addSpeed = car.speed - GameData.getInstance().speed;
                addSpeed *= GameData.speedRate;
                car.bottom += addSpeed;
                if(car.bottom < - 300 || (car.bottom > GameManager.stage.stageHeight + 200))
                {
                    CarMC.freeItem(car);
                    this.road[s].car = null;
                }
            }
            else
            {
                emptyPos.push(this.road[s]);
            }
        }

        if(this.gameState)
            return;

        if(emptyPos.length>0 && egret.getTimer() - this.lastCreateCarTime > 500 && Math.random() < 0.1)
        {
            this.lastCreateCarTime = egret.getTimer();
            var oo = ArrayUtil.randomOne(emptyPos)
            var car = CarMC.createItem();
            car.scaleX = car.scaleY = 0.7;
            car.setCar(Math.ceil(12*Math.random()))
            oo.car = car;
            car.horizontalCenter = oo.pos;
            car.speed = Math.floor(50 + Math.random()*70)
            this.addChildAt(car,this.carIndex);
            if(oo.pos < 0)//右
            {
                car.scaleY *= -1;
                car.speed *= -0.6;
                car.bottom = GameManager.stage.stageHeight + 100;
            }
            else
            {
                if(car.speed < GameData.getInstance().speed)
                    car.bottom = GameManager.stage.stageHeight + 100;
                else
                    car.bottom = -150;
            }
        }
    }

    private onMoveBG(speed){
        speed *= GameData.speedRate;
        var des = 160;
        this.line1.bottom  -= speed
        this.line2.bottom  -= speed
        this.bg.bottom  -= speed
        if(this.line1.bottom < -des)
            this.line1.bottom += des
        if(this.line2.bottom < -des)
            this.line2.bottom += des
        if(this.bg.bottom < -100)
            this.bg.bottom += 100

        for(var i=0;i<this.treeArr1.length;i++)
        {
            this.treeArr1[i].bottom -= speed;
            if(this.treeArr1[i].bottom < -200)
            {
                this.freeTree(this.treeArr1[i])
                this.treeArr1.splice(i,1);
                i --;
            }
        }
        for(var i=0;i<this.treeArr2.length;i++)
        {
            this.treeArr2[i].bottom -= speed;
            if(this.treeArr2[i].bottom < -200)
            {
                this.freeTree(this.treeArr2[i])
                this.treeArr2.splice(i,1);
                i --;
            }
        }

        var treeDes = 150;
        while(!this.treeArr1[0] || this.treeArr1[this.treeArr1.length-1].bottom < GameManager.stage.stageHeight-treeDes){
             var tree = this.getTree();
            if(!this.treeArr1[0])
                tree.bottom = 0;
            else
                tree.bottom = this.treeArr1[this.treeArr1.length-1].bottom + treeDes + Math.random()*20;
            this.treeArr1.push(tree);
            this.treeGroup.addChildAt(tree,0);
            tree.right = 590
        }
        while(!this.treeArr2[0] || this.treeArr2[this.treeArr2.length-1].bottom < GameManager.stage.stageHeight-treeDes){
             var tree = this.getTree();
            if(!this.treeArr2[0])
                tree.bottom = 0;
            else
                tree.bottom = this.treeArr2[this.treeArr2.length-1].bottom + treeDes + Math.random()*20//treeDes;
            this.treeArr2.push(tree);
            this.treeGroup.addChildAt(tree,0);
            //this.addChild(this.speedBtn);
            tree.right = -30
        }
    }

    private getTree(){
        var mc:eui.Image = this.treePool.pop();
        if(!mc)
        {
            mc = new eui.Image()
        }
        mc.source = 'tree_'+Math.ceil(2+Math.random()*6)+'_png'
        return mc;
    }

    private freeTree(mc){
        MyTool.removeMC(mc);
        this.treePool.push(mc);
    }
}