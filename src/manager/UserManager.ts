class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public gameid: string;
    public nick: string;
    public head: string;
    public dbid: string;
    public gender: number;
    public isScope: boolean = false;

    public isTest = false;
    public shareFail = false;
    public testVersion = 20190521;


    public fill(data:any):void{
        this.dbid = data._id;
        CarManager.getInstance().initData(data);
    }

    public renewInfo(userInfo){
        this.isScope = true;
        this.nick = userInfo.nickName
        this.head = userInfo.avatarUrl
        this.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
    }

    public getUserInfo(fun){
        var wx = window['wx'];
        const db = wx.cloud.database();

        wx.cloud.callFunction({      //取玩家openID,
            name: 'getInfo',
            complete: (res) => {
                console.log(res)
                this.gameid = res.result.openid
                this.isTest = res.result.testVersion == this.testVersion;
                this.shareFail = res.result.shareFail;
                TimeManager.getInstance().initlogin(res.result.time)
                db.collection('user').where({     //取玩家数据
                    _openid: this.gameid,
                }).get({
                    success: (res)=>{
                        if(res.data.length == 0)//新用户
                        {
                            this.onNewUser(fun)
                            return;
                        }
                        //this.testAddInvite()//debug
                        this.fill(res.data[0]);
                        fun && fun();
                    }
                })
            }
        })


    }
    //public updateUserInfo(data,fun){
    //    var wx = window['wx'];
    //    const db = wx.cloud.database();
    //
    //    db.collection('user').doc(this.dbid).update({
    //        data: {
    //            isScope:true,
    //        },
    //        success: ()=>{
    //            this.isScope = true;
    //            fun && fun();
    //        },
    //    })
    //
    //}

    private testAddInvite(){
        var wx = window['wx'];
        var query = wx.getLaunchOptionsSync().query;
        if(query.type == '1')
        {
            wx.cloud.callFunction({      //取玩家openID,
                name: 'onShareIn',
                data:{
                    other:query.from,
                    skinid:query.skinid,
                },
                complete: (res) => {
                     //console.log(res)
                }
            })
        }
    }

    //新用户注册
    private onNewUser(fun?){
        var wx = window['wx'];
        const db = wx.cloud.database();
        var initData:any = {
            skinNum:1,   //已有皮肤
            skinid:1,  //当前使用皮肤
            skinsData:{}, //皮肤相关的额外数据
            levelData:{}, //关卡数据
        };
        db.collection('user').add({
            data:initData,
            success: (res)=>{
                initData._id = res._id;
                this.fill(initData);
                fun && fun();
            }
        })

        this.testAddInvite();
    }



    //public testDiamond(v){
    //    if(UM.diamond < v)
    //    {
    //        MyWindow.Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.diamond + '\n是否前往购买钻石？',function(v){
    //            if(v == 1)
    //            {
    //                //ShopUI.getInstance().show(true);
    //            }
    //        },['取消','购买'])
    //        return false;
    //    }
    //    return true;
    //}
    //public testCoin(v){
    //    var coin = UM.coin;
    //    if(coin < v)
    //    {
    //        MyWindow.Confirm('金币不足！\n需要：' +v+'\n当前：'+coin + '\n是否前往购买金币？',function(v){
    //            if(v == 1)
    //            {
    //                //ShopUI.getInstance().show('coin');
    //            }
    //        },['取消','购买'])
    //        return false;
    //    }
    //    return true;
    //}
}
