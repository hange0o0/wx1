class GameData {
    private static instance:GameData;
    public static getInstance():GameData {
        if (!this.instance)
            this.instance = new GameData();
        return this.instance;
    }
    public static speedRate = 0.25; //速度转像素的比例
    public static Frame = 60; //帧频
    public static MPV = 3600/1000 * 60 * 0.25; //米与象素转换的常量  =54
    public static MaxLevel = 30; //关卡总数
    public static MaxCar = 12; //关卡总数
    public static AlertMeter = 100; //警告米数
    public static FailDecTime = 10*1000; //碰到红线扣除的时间


    public isPlaying = false;
    public speed = 0;
    public maxSpeed = 0;
    public carid = 0;
    public addSpeed_ = 0;
    public decSpeed_ = 0;
    public addSpeedNum = 0;   //调用加速的次数
    public decSpeedNum = 0;   //调用减速的次数

    public lastAddSpeedTime = 0;
    public maxLen = 0;
    public startTime = 0;
    public baseSpeed = 20;
    public maxTime = 30*1000;


    public redArr = [];
    public level = 1;
    public countDown = 0;
    public passMeter = 0;//玩家经过的米数



    //1 = '完成第'+max+'关'
    //2 = max + '小时后获得'
    //3 = '邀请'+max+'个新用户'
    //4 = '观看广告'+max+'次'
    //5 = '总星星数'+max+'个'
    //6 = '推荐好友'
    //7 = '挑战解锁'
    //public carData = {             //debug
    //    1:{maxSpeed:100,addSpeed:5,decSpeed:15,buyType:0,buyValue:0,artid:1},
    //    2:{maxSpeed:110,addSpeed:6,decSpeed:15,buyType:1,buyValue:3,artid:2},
    //    3:{maxSpeed:120,addSpeed:7,decSpeed:20,buyType:2,buyValue:0.1,artid:3},
    //    4:{maxSpeed:125,addSpeed:8,decSpeed:25,buyType:3,buyValue:1,artid:4},
    //    5:{maxSpeed:130,addSpeed:8,decSpeed:30,buyType:1,buyValue:10,artid:5},
    //    6:{maxSpeed:135,addSpeed:9,decSpeed:35,buyType:2,buyValue:0.1,artid:6},
    //    7:{maxSpeed:140,addSpeed:9,decSpeed:30,buyType:3,buyValue:1,artid:7},
    //    8:{maxSpeed:145,addSpeed:10,decSpeed:35,buyType:2,buyValue:0.1,artid:8},
    //    9:{maxSpeed:150,addSpeed:10,decSpeed:40,buyType:2,buyValue:0.1,artid:9},
    //    10:{maxSpeed:155,addSpeed:11,decSpeed:35,buyType:1,buyValue:0.1,artid:10},
    //    11:{maxSpeed:160,addSpeed:11,decSpeed:45,buyType:3,buyValue:1,artid:11},
    //    12:{maxSpeed:160,addSpeed:12,decSpeed:50,buyType:2,buyValue:0.1,artid:12},
    //}
    public carData = {
        1:{maxSpeed:80,addSpeed:5,decSpeed:15,buyType:0,buyValue:0,artid:1},
        2:{maxSpeed:90,addSpeed:7,decSpeed:15,buyType:1,buyValue:2,artid:2},
        3:{maxSpeed:100,addSpeed:7,decSpeed:20,buyType:7,buyValue:30,artid:8},
        4:{maxSpeed:110,addSpeed:8,decSpeed:30,buyType:4,buyValue:1,artid:11},
        5:{maxSpeed:110,addSpeed:10,decSpeed:20,buyType:1,buyValue:8,artid:3},
        6:{maxSpeed:120,addSpeed:12,decSpeed:35,buyType:6,buyValue:1,artid:4},
        7:{maxSpeed:120,addSpeed:18,decSpeed:30,buyType:7,buyValue:60,artid:7},
        8:{maxSpeed:130,addSpeed:15,decSpeed:35,buyType:3,buyValue:1,artid:6},
        9:{maxSpeed:130,addSpeed:16,decSpeed:45,buyType:5,buyValue:40,artid:9},
        10:{maxSpeed:140,addSpeed:16,decSpeed:60,buyType:1,buyValue:18,artid:10},
        11:{maxSpeed:150,addSpeed:20,decSpeed:50,buyType:4,buyValue:3,artid:5},
        12:{maxSpeed:160,addSpeed:20,decSpeed:60,buyType:3,buyValue:2,artid:12},
    }

    //米 转 象素
    public meterToPix(m){
        return m*GameData.MPV
    }

    //象素 转 米
    public pixToMeter(p){
        return  p/GameData.MPV
    }

    public getStarByLevel(lv,useTime){
        var maxTime = this.getMaxTime(lv);
        var rate = useTime/maxTime
        if(rate < 0.7)
            return 3;
        if(rate < 0.85)
            return 2;
        return 1;
    }

    public getMaxTime(lv){
        return Math.min((lv-1)*5 + 25,180)*1000
    }

    public onRunSpeed(){
        if(!this.countDown)
        {
            if(this.lastAddSpeedTime)
            {
                var cd = egret.getTimer() - this.lastAddSpeedTime
                this.passMeter += (this.speed*1000/3600) * (cd/1000)
            }
            this.lastAddSpeedTime = egret.getTimer()
        }
    }

    public onGameStart(lv){

        this.level = lv;
        this.isPlaying = true;
        this.speed = this.baseSpeed;
        this.startTime = egret.getTimer();
        this.passMeter = 0
        this.countDown = 4;
        this.lastAddSpeedTime = 0;

        //生成关卡数据

        this.maxTime = this.getMaxTime(this.level)
        var maxLen = 80*1000/3600*(this.maxTime/1000);//100KM速度行使指定时间的距离（米）
        maxLen = Math.floor(maxLen*(0.5 + this.level/GameData.MaxLevel))//最终的行走距离
        var addDec = 100 + GameData.AlertMeter - 100*this.level/GameData.MaxLevel;//两个红块间的间隔

        this.redArr = []
        var currentPos = 0;
        while(currentPos < maxLen)
        {
            currentPos += addDec + Math.random()*addDec*0.4 + 10;
            var oo = {
                start:currentPos,
                speed:60 + Math.floor(Math.random()*4)*10 +  Math.floor(this.level/8)*10
            }
            this.redArr.push(oo)
        }
        this.redArr.pop();
        this.maxLen = maxLen;
        console.log(this.maxLen,this.redArr);
    }

    public addSpeed(isAdd){
        if(isAdd)
        {
            this.addSpeedNum += 1;
            if(this.addSpeedNum > 30)
                this.addSpeedNum = 30;
            this.speed += this.addSpeed_*(this.addSpeedNum)*0.003;
            if(this.speed > this.maxSpeed)
                this.speed = this.maxSpeed;
        }
        else
            this.addSpeedNum = 0;

    }

    public decSpeed(isAdd){
        if(isAdd)
        {
            this.decSpeedNum += 1;
            if(this.decSpeedNum > 30)
                this.decSpeedNum = 30;

            this.speed -= this.decSpeed_*(this.decSpeedNum)*0.003;
            if(this.speed < 0)
                this.speed = 0;
        }
        else
            this.decSpeedNum = 0;
    }

    public setCar(id){
        this.carid = id;
        var vo = this.carData[id];
        this.maxSpeed = vo.maxSpeed
        this.addSpeed_ = vo.addSpeed
        this.decSpeed_ = vo.decSpeed
    }

    public sendKey
    public sendKeyName
    public sendGameStart(key){
        var wx = window['wx']
        if(!wx)
            return;
        this.sendKey = key
        this.sendKeyName = '第'+key+'关'
        wx.aldStage.onStart({
            stageId : this.sendKey, //关卡ID， 必须是1 || 2 || 1.1 || 12.2 格式  该字段必传
            stageName : this.sendKeyName,//关卡名称，该字段必传
            userId  : UM.gameid//用户ID
        })
    }


    public sendGameEnd(success?,info?){
        var wx = window['wx']
        if(!wx)
            return;
        wx.aldStage.onEnd({
            stageId : this.sendKey,    //关卡ID 该字段必传
            stageName : this.sendKeyName, //关卡名称  该字段必传
            userId : UM.gameid,  //用户ID 可选
            event :success?"complete":"fail",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
            params : {
                desc :info   //描述
            }
        })
    }
}