class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    private bg: eui.Image;
    private line2: eui.Image;
    private line1: eui.Image;
    private errorMC: eui.Image;
    private treeGroup: eui.Group;
    private titleMC: eui.Image;
    private startBtn: eui.Image;
    private bottomGroup: eui.Group;
    private rankBtn: eui.Image;
    private levelBtn: eui.Image;
    private skinBtn: eui.Image;
    private settingBtn: eui.Image;
    private levelGroup: eui.Group;
    private levelText: eui.Label;
    private debugBtn: eui.Button;
    private readyText: eui.Label;
    private guideText: eui.Label;
    private rightBtn: eui.Rect;
    private leftBtn: eui.Rect;
    private meterGroup: eui.Group;
    private speedText: eui.Label;
    private needle: eui.Image;
    private limitGroup: eui.Group;
    private rateMC2: eui.Image;
    private exitBtn: eui.Group;
    private gameLevelText: eui.Label;
    private failMC: eui.Image;
    private tipsGroup: eui.Group;
    private jumpMC: JumpMC;
    private jumpMC2: JumpMC;




    private infoBtn:UserInfoBtn



    public posRateMC = new egret.Shape()
    public cdRateMC = new egret.Shape()
    public alarmMC = new egret.Shape()


    private timer = new MyTimer(1000/GameData.Frame);
    private carMC;
    private alarm = 0
    private lastDrawAlarm = 0

    //private speedState = 0;
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
    private guideStep = 0

    private soundTimer = 0

    private carSkin

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    public show() {
        super.show();
    }

    public childrenCreated() {
        super.childrenCreated();

        this.leftBtn.visible = this.rightBtn.visible = true;

        this.alarmMC.x = this.posRateMC.x = this.cdRateMC.x = 152
        this.alarmMC.y = this.posRateMC.y = this.cdRateMC.y = 154

        this.meterGroup.addChildAt(this.alarmMC,1)
        this.meterGroup.addChildAt(this.posRateMC,0)
        this.meterGroup.addChildAt(this.cdRateMC,0)

        //this.meterGroup.addChild(this.posRateMC)
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
        this.addBtnEvent(this.exitBtn, this.reset);
        this.addBtnEvent(this.debugBtn, this.onDebug);

        this.debugBtn.visible = false;

        this.addBtnEvent(this.startBtn, this.onStart);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onE,this)

        this.carMC = new CarMC();
        this.carMC.setCar(1)
        this.addChildAt(this.carMC,this.carIndex);
        this.carMC.scaleX = this.carMC.scaleY = 0.7;
        this.carMC.horizontalCenter = 75
        this.carMC.bottom = 350;

        this.failMC.visible = false

        this.infoBtn = new UserInfoBtn(this.startBtn, (res)=>{
            //UserManager.getInstance().updateUserInfo(res,()=>{
                this.renewInfo(res);
            //});

        }, this, Config.localResRoot + "wx_btn_info.png");


        this.renewSound();
    }

    public cleanTouch(){
        this.touchID = {};
    }

    public showTimeNum(num){
        var str = '9876543210'

        this.gameLevelText && (this.gameLevelText.text = str.substr(-num))
    }

    private renewInfo(res?){
        return;
        var wx = window['wx'];
        if(!wx)
            return;
        if(res)
        {
            this.infoBtn.visible = false;
            UM.renewInfo(res.userInfo)
            this.bottomGroup.visible = true;
            this.levelGroup.visible = true;
            return;
        }
        this.bottomGroup.visible = false;
        this.levelGroup.visible = false;
        this.startBtn.visible = false
        wx.getSetting({
            success: (res) =>{
                console.log(res.authSetting)
                if(res.authSetting["scope.userInfo"])//已授权
                {
                    wx.getUserInfo({
                        success: (res) =>{
                            var userInfo = res.userInfo
                            UM.renewInfo(res.userInfo)
                            UM.head = userInfo.avatarUrl
                            UM.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
                            this.bottomGroup.visible = true;
                            this.levelGroup.visible = true;
                            this.infoBtn.visible = false;
                            this.startBtn.visible = true
                        }
                    })
                }
                else
                {
                    this.infoBtn.visible = true;
                }
            }
        })
    }

    private onDebug(){
        DebugUI.getInstance().show();
    }

    private showFailMC(){
        this.failMC.visible = true
        this.failMC.alpha = 0
        egret.Tween.removeTweens(this.failMC)
        egret.Tween.get(this.failMC).to({alpha:0.5},250).to({alpha:0},250).call(()=>{
            this.failMC.visible = false
        })
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
        SoundManager.getInstance().soundPlaying = !SoundManager.getInstance().soundPlaying
        SoundManager.getInstance().bgPlaying = !SoundManager.getInstance().bgPlaying
        this.renewSound();

    }

   private renewSound(){
       this.settingBtn.source = SoundManager.getInstance().bgPlaying?'sound_on_btn_png':'sound_off_btn_png'
   }




    //private onSlow(){
    //    this.speedState = -1;
    //}
    //
    //private onSpeed(){
    //    this.speedState = 1;
    //}

    public onStart(){
        //if(!UM.isTest && GameData.getInstance().carData[CarManager.getInstance().skinNum + 1])
        //{
        //    TryCarUI.getInstance().show();
        //    return;
        //}
        //this.playGame();
        this.callStartLevel(Math.min(CarManager.getInstance().maxLevel + 1,GameData.MaxLevel))
    }

    //public playGame(carid?){
    //   this.carSkin = carid || CarManager.getInstance().skinid;
    //    this.startLevel(Math.min(CarManager.getInstance().maxLevel + 1,GameData.MaxLevel))
    //}

    public renewCar(){
        this.carSkin = CarManager.getInstance().skinid
        this.carMC.setCar(this.carSkin);
    }

    public callStartLevel(lv){
        if(GameData.getInstance().carData[CarManager.getInstance().skinNum + 1])
        {
            TryCarUI.getInstance().show(lv);
            return;
        }
        this.startLevel(lv)
    }

    public startLevel(lv,carSkin?){
        this.carSkin = carSkin || CarManager.getInstance().skinid;
        this.tipsGroup.visible = false;
        this.carMC.visible = true
        GameData.getInstance().setCar(this.carSkin)
        this.carMC.setCar(this.carSkin)
        GameData.getInstance().onGameStart(lv)
        this.leftBtn.visible = this.rightBtn.visible = false;

        this.touchID = {};
        this.currentState = 'game'

        this.alarm = 0
        this.limitGroup.visible = false;
        this.posRateMC.visible = false;
        this.cdRateMC.visible = false;
        this.errorMC.visible = false;
        this.alarmMC.visible = false;

        this.posRateMC['rate'] = -1
        this.cdRateMC['rate'] = -1



        this.gameLevelText.text = 'LV.' + lv

        this.guideStep = 0;
        this.guideText.text = '';
        if(CarManager.getInstance().isGuide)
        {
            setTimeout(()=>{
                this.guideStep = 1;
                this.rightBtn.visible = true;
                this.guideText.text = '手指停在右则屏幕进行加速'
                this.showGuideMV();
            },500)
        }

        this.soundTimer = egret.getTimer() + 5*Math.random()*1000
    }

    public onShow(){
        this.tipsGroup.visible = true;
        this.carMC.visible = false;
        setTimeout(()=>{
            this.tipsGroup.visible = false;
            this.carMC.visible = true
        },2000);
        SoundManager.getInstance().playSound('bg');
        this.renewInfo();
        this.timer.start()
        this.reset();
        this.renewCar();
        //this.addPanelOpenEvent(GameEvent.client.SKIN_CHANGE,this.renewCar)
        //this.addPanelOpenEvent(GameEvent.client.INFO_CHANGE,this.renew)
    }

    public reset(){
        this.renewCar();
        this.jumpMC.show()
        this.jumpMC2.show()
        this.currentState = 'main'
        this.gameState = 0;
        this.line1.bottom = 0;
        this.line2.bottom = 0;
        this.bg.bottom = 0;
        this.errorMC.visible = false;
        var level = Math.min(CarManager.getInstance().maxLevel + 1,GameData.MaxLevel)
        this.levelText.text = '第 ' + level + ' 关';
        GameData.getInstance().isPlaying = false;

        for(var s in this.road) {
            var car = this.road[s].car;
            if (car) {
                CarMC.freeItem(car);
                this.road[s].car = null;
            }
        }
    }


    private onE(){
        //var t = egret.getTimer();
        var GD = GameData.getInstance();
         if(!GD.isPlaying)
         {

             if(this.gameState)
             {
                 this.errorMC.visible = false;
                 var targetSpeed = this.gameState == 2?0:GD.baseSpeed;
                 if(GD.speed > targetSpeed)
                 {
                     GD.decSpeed(true);
                 }
                 this.speedText.text = Math.floor(GD.speed) + ''
                 this.onMoveBG(GD.speed);
                 this.onOtherCarMove();
             }
             else
                this.onMoveBG(GD.baseSpeed);
             return;
         }

        if(GD.countDown)
        {
            var num = 3-Math.floor((egret.getTimer() - GD.startTime)/1000)
            if(num <= 0)
            {
                SoundManager.getInstance().playEffect('count_down4')
                GD.countDown = 0;
                GD.startTime = egret.getTimer();//真正开始
                this.readyText.text = '';
                this.posRateMC.visible = true;
                this.cdRateMC.visible = true;
                this.resetRed();
            }
            else if(GD.countDown != num)
            {
                SoundManager.getInstance().playEffect('count_down')

                GD.countDown = num
                this.readyText.text = '' + num;
                egret.Tween.removeTweens(this.readyText)
                this.readyText.scaleX = this.readyText.scaleY = 0
                egret.Tween.get(this.readyText).to({scaleX:1.2,scaleY:1.2},250).to({scaleX:1,scaleY:1},250)
            }
        }

        var isAdd = false;
        //var isDec = false;
        var isDec = false;
        for(var s in this.touchID)
        {
            var touch = this.touchID[s];
            if(!isAdd && this.rightBtn.hitTestPoint(touch.x,touch.y))
                isAdd = true;
            if(!isDec && this.leftBtn.hitTestPoint(touch.x,touch.y))
                isDec = true;

            //isAdd = true;
            //isDec = false;
        }
        GD.addSpeed(isAdd);
        GD.decSpeed(isDec)
        if(GD.speed < GD.baseSpeed)
            GD.speed = GD.baseSpeed
        if(this.guideStep == 1 && isAdd)
        {
            this.guideText.text = ''
            this.rightBtn.visible = false;
            this.leftBtn.visible = false;
            this.guideStep = 2;
        }
        else if(this.guideStep == 3 && isDec)
        {
            this.rightBtn.visible = false;
            this.leftBtn.visible = false;
            this.guideText.text = ''
            this.guideStep = 0;
            SharedObjectManager.getInstance().setMyValue('finishGuide',true)
            CarManager.getInstance().isGuide = false;
        }

        //if(isAdd)
        //    SoundManager.getInstance().playSound('motor1')
        //else if(isDec && GD.speed > GD.baseSpeed)
        //    SoundManager.getInstance().playSound('brake')

        var speed = GD.speed;
        this.onMoveBG(speed);
        GD.onRunSpeed();
        var rate = Math.min(1,GD.passMeter/GD.maxLen);
        if(this.posRateMC.visible && Math.abs(this.posRateMC['rate'] - rate) > 0.0015)
        {
            MyTool.getSector(159,180,rate*180,0x000099,1,this.posRateMC)
            this.posRateMC['rate'] = rate
        }
            //MyTool.getSector(159,162,rate*216,0x000099,1,this.posRateMC)
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
            GD.isPlaying = false
            this.gameState = 1;
            ResultUI.getInstance().show();
            return;
        }

        if(this.cdRateMC.visible)
        {
            var cdRate = (egret.getTimer() - GD.startTime)/GD.maxTime;
            if(Math.abs(this.cdRateMC['rate'] - cdRate) > 0.0015)
            {
                MyTool.getSector(166,180,cdRate*180,0xFCD550,1,this.cdRateMC);
                this.cdRateMC['rate'] = cdRate
            }
            //MyTool.getSector(166,162,cdRate*216,0xFCD550,1,this.cdRateMC);
        }

        if(egret.getTimer() > this.soundTimer)
        {
            SoundManager.getInstance().playEffect('road')
            this.soundTimer = egret.getTimer() + 4*1000 + 5*Math.random()*1000
        }


        //var cd2 =  Math.floor((cd%1000)/10)
        //cd = Math.floor(cd/1000)
        //this.cdText.text = DateUtil.getStringBySecond(cd).substr(-5) + '.' + ('00' + cd2).substr(-2)

        this.speedText.text = Math.floor(GD.speed) + ''
        var speedDec = GD.speed/GD.maxSpeed*3
        if(speedDec < 1)
            speedDec = 0;
        this.needle.rotation = 180 + GD.speed/160*180 + (Math.random()-0.5)*speedDec;

        this.onOtherCarMove();

        if(!GD.countDown && this.errorMC.visible)
        {
            var oo = GD.redArr[0];
            var meter = oo.start - GD.passMeter //离红色的距离
            var redLast = 1// - GD.pixToMeter(this.carMC.height*this.carMC.scaleY);//离红色块的大小
             this.errorMC.bottom = this.carMC.bottom + this.carMC.height*this.carMC.scaleY +  GD.meterToPix(meter)
            if(this.alarm == 0 && meter <= GameData.AlertMeter && meter > GameData.AlertMeter/2)  //发出警告
            {
                this.alarm = 1;
                this.lastDrawAlarm = 0
                SoundManager.getInstance().playEffect('limit' + oo.speed)

                if(this.guideStep == 2)
                {
                    this.rightBtn.visible = false;
                    this.leftBtn.visible = true;
                    this.guideText.text = '手指停在左则屏幕进行减速'
                    this.showGuideMV();
                    this.guideStep = 3;
                }
            }

            this.limitGroup.visible = this.alarm == 1;
            this.alarmMC.visible = this.alarm == 1;

            if(this.alarmMC.visible)
            {
                var cdRate = oo.speed/160;
                if(oo.speed <= GD.speed)
                    var draw = 1
                else
                    var draw = 2

                if(this.lastDrawAlarm != draw)
                {
                    this.lastDrawAlarm = draw;
                    if(draw == 1)
                        MyTool.getSector(100,180,cdRate*180,0xFF0000,1,this.alarmMC);
                    else
                        MyTool.getSector(100,180,cdRate*180,0x00FF00,1,this.alarmMC);
                }
            }

            if(meter <=0 && this.alarm < 2)//红块内
            {
                this.alarm = 2;
                if(GD.speed > oo.speed)//超速
                {
                    SoundManager.getInstance().playEffect('photo')
                    GD.startTime -= GameData.FailDecTime
                    this.showFailMC();

                    GD.redArr.shift();

                    this.resetRed();

                    this.limitGroup.visible = false;
                    this.alarmMC.visible = false;
                }
            }
            else if(this.alarm == 2)
            {
                this.alarm = 3;
                SoundManager.getInstance().playEffect('pass')
            }
            else if(this.alarm  == 3)//过了红线
            {

                if(this.errorMC.bottom < -this.errorMC.height)
                {
                    GD.redArr.shift();
                    this.resetRed();
                }
            }

            if(this.limitGroup.visible)
            {
                this.rateMC2.width = 200* Math.min((GameData.AlertMeter - meter)/GameData.AlertMeter,1)
            }
        }

        //console.log(egret.getTimer() - t)
    }

    private showGuideMV(){
        egret.Tween.get(this.guideText).to({scaleX:0,scaleY:0}).to({scaleX:1.2,scaleY:1.2},250).to({scaleX:1,scaleY:1},250)
    }

    private resetRed(){
        this.alarm = 0;
        var GD = GameData.getInstance();
        var oo = GD.redArr[0];
        if(!oo)
        {
            this.errorMC.visible = false;
            return;
        }
        this.errorMC.visible = true;
    }

    private onOtherCarMove(){
        //return;
        var emptyPos = [];
        for(var s in this.road)
        {
            var car:CarMC = this.road[s].car;
            if(car)
            {
                var addSpeed = car.speed - GameData.getInstance().speed;
                addSpeed *= GameData.speedRate;
                car.bottom += addSpeed;
                if(car.bottom < - 300 || (car.bottom > GameManager.uiHeight + 200))
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
                car.bottom = GameManager.uiHeight + 100;
            }
            else
            {
                if(car.speed < GameData.getInstance().speed)
                    car.bottom = GameManager.uiHeight + 100;
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

        //return;
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
        while(!this.treeArr1[0] || this.treeArr1[this.treeArr1.length-1].bottom < GameManager.uiHeight-treeDes){
             var tree = this.getTree();
            if(!this.treeArr1[0])
                tree.bottom = 0;
            else
                tree.bottom = this.treeArr1[this.treeArr1.length-1].bottom + treeDes + Math.random()*20;
            this.treeArr1.push(tree);
            this.treeGroup.addChildAt(tree,0);
            tree.right = 590
        }
        while(!this.treeArr2[0] || this.treeArr2[this.treeArr2.length-1].bottom < GameManager.uiHeight-treeDes){
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
            mc.source = 'tree_'+Math.ceil(2+Math.random()*6)+'_png'
        }
        return mc;
    }

    private freeTree(mc){
        MyTool.removeMC(mc);
        this.treePool.push(mc);
    }
}