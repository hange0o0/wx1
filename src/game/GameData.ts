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
    public static MaxLevel = 50; //关卡总数
    public static AlertMeter = 50; //警告米数

    public isPlaying = false;
    public speed = 0;
    public maxSpeed = 0;
    public carid = 0;
    public addSpeed_ = 0;
    public decSpeed_ = 0;

    public maxLen = 0;
    public startTime = 0;
    public baseSpeed = 20;
    public maxTime = 30*1000;


    public redArr = [];
    public level = 1;
    public passMeter = 0;//玩家经过的米数


    public carData = {
        1:{maxSpeed:100,addSpeed:5,decSpeed:10,buyType:0,buyValue:0}
    }

    //米 转 象素
    public meterToPix(m){
        return m*GameData.MPV
    }

    //象素 转 米
    public pixToMeter(p){
        return  p/GameData.MPV
    }

    public onRunSpeed(){
        this.passMeter += this.speed*1000/3600/GameData.Frame
    }

    public onGameStart(lv){
        this.level = lv;
        this.isPlaying = true;
        this.speed = this.baseSpeed;
        this.startTime = egret.getTimer();
        this.passMeter = 0

        //生成关卡数据

        this.maxTime = Math.min((this.level-1)*5 + 25,180)*1000
        var maxLen = 100*1000/3600*(this.maxTime/1000);//100KM速度行使指定时间的距离（米）
        maxLen = Math.floor(maxLen*(0.5 + this.level/GameData.MaxLevel))//最终的行走距离
        var addDec = 100 + GameData.AlertMeter - 100*this.level/GameData.MaxLevel;//两个红块间的间隔

        this.redArr = []
        var currentPos = 0;
        while(currentPos < maxLen)
        {
            currentPos += addDec + Math.random()*addDec*0.4 + 10;
            var oo = {
                start:currentPos,
                speed:40 + Math.floor(Math.random()*6)*10,
                len:this.pixToMeter(500+Math.random()*(1000 * (GameData.MaxLevel - this.level)/GameData.MaxLevel))
            }
            currentPos += oo.len;
            this.redArr.push(oo)
        }
        this.redArr.pop();
        this.maxLen = maxLen;
        console.log(this.maxLen,this.redArr)
    }

    public addSpeed(){
        this.speed += this.addSpeed_*0.1;
        if(this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
    }

    public decSpeed(){
        this.speed -= this.decSpeed_*0.1;
        if(this.speed < 0)
            this.speed = 0;
    }

    public setCar(id){
        this.carid = id;
        var vo = this.carData[id];
        this.maxSpeed = vo.maxSpeed
        this.addSpeed_ = vo.addSpeed
        this.decSpeed_ = vo.decSpeed
    }
}