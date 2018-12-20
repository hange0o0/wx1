class MyTimer extends egret.EventDispatcher {
    private cd = 0;
    private timer
    private lastTime = 0;
    public constructor(v) {
        super();
        this.cd = v;
        this.timer = new egret.Timer(v);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onE,this)


    }

    private onE(){
        var num = Math.floor((egret.getTimer() - this.lastTime)/this.cd)
        while(num --)
        {
            this.dispatchEventWith(egret.TimerEvent.TIMER)
            this.lastTime += this.cd;
        }

    }

    public start(){
       this.timer.start();
        this.lastTime = egret.getTimer()
    }

    public stop(){
        this.timer.stop();
    }



}