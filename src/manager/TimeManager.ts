class TimeManager {
    public constructor() {
    }

    private static _instance: TimeManager;

    public static getInstance():TimeManager{
        if(!TimeManager._instance)
            TimeManager._instance = new TimeManager();
        return TimeManager._instance;
    }

    public timeDiff: number = 0;
    public loginTime: number = 0;//等陆时的服务器时间

    private loginWXTime = 0;
    public init(time:number):void{
        //本地和服务器的时间差
        this.timeDiff = Math.floor(Date.now() / 1000 - time);
    }

    public getTimer(){
        var wx = window['wx'];
        if(wx)
            return  Math.floor((wx.getPerformance().now() -  this.loginWXTime)/1000)
        return egret.getTimer();
    }

    public initlogin(t){
        var wx = window['wx'];
        this.loginWXTime = wx.getPerformance().now()
        this.loginTime = Math.floor(t/1000)//Math.floor((t - wx.getPerformance().now())/1000);
    }

    public now():number{
        if(this.loginTime)
        {
            var wx = window['wx'];
            return this.loginTime + Math.floor(this.getTimer()/1000)
        }
        return Math.floor(Date.now() / 1000) - this.timeDiff //+ 24*3600 *7;
    }
    public nowMS():number{
        if(this.loginTime)
        {
            var wx = window['wx'];
            return this.loginTime*1000 + this.getTimer();
        }
        return Date.now() - this.timeDiff*1000
    }

    public getLastDayOfWeekDate(time:number, endDay:any):Date{
        endDay = endDay || 5;
        //得到今天是周几
        var d = new Date(time * 1000);
        var curDay = d.getDay();
        var add = endDay > curDay
            ? endDay - curDay
            : 7 - (curDay - endDay);

        return new Date(d.getTime() + add * 24 * 3600 * 1000);
    }

    public offsetDate():Date{
        var offsetTime = -21600;
        var time = this.now();
        time += offsetTime;
        return DateUtil.timeToChineseDate(time);
    }

    public chineseDate():Date{
        return DateUtil.timeToChineseDate(this.now());
    }

    public getNextDateTime():number{
        return DateUtil.getNextDateTimeByHours(6);
    }

}
