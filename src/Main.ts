////////////////////////////////////////////////////////////////////////////////////////
////
////  Copyright (c) 2014-present, Egret Technology.
////  All rights reserved.
////  Redistribution and use in source and binary forms, with or without
////  modification, are permitted provided that the following conditions are met:
////
////     * Redistributions of source code must retain the above copyright
////       notice, this list of conditions and the following disclaimer.
////     * Redistributions in binary form must reproduce the above copyright
////       notice, this list of conditions and the following disclaimer in the
////       documentation and/or other materials provided with the distribution.
////     * Neither the name of the Egret nor the
////       names of its contributors may be used to endorse or promote products
////       derived from this software without specific prior written permission.
////
////  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
////  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
////  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
////  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
////  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
////  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
////  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
////  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
////  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
////  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////
////////////////////////////////////////////////////////////////////////////////////////
//var UM:UserManager,TM:TimeManager,EM:EventManager
//class Main extends eui.UILayer {
//
//
//    protected createChildren(): void {
//        super.createChildren();
//        UM = UserManager.getInstance();
//        TM = TimeManager.getInstance();
//        EM = EventManager.getInstance();
//
//        egret.lifecycle.addLifecycleListener((context) => {
//            // custom lifecycle plugin
//        })
//
//        egret.lifecycle.onPause = () => {
//            egret.ticker.pause();
//        }
//
//        egret.lifecycle.onResume = () => {
//            egret.ticker.resume();
//        }
//
//        //inject the custom material parser
//        //注入自定义的素材解析器
//        let assetAdapter = new AssetAdapter();
//        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
//        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
//
//
//        this.runGame().catch(e => {
//            console.log(e);
//        })
//    }
//
//    private async runGame() {
//    await this.loadResource()
//    this.createGameScene();
//    //const result = await RES.getResAsync("description_json")
//    //this.startAnimation(result);
//    //await platform.login();
//    //const userInfo = await platform.getUserInfo();
//    //console.log(userInfo);
//
//}
//
//    private async loadResource() {
//    try {
//        //const loadingView = new LoadingUI();
//        //this.stage.addChild(loadingView);
//        await RES.loadConfig("resource/default.res.json", "resource/");
//        await this.loadTheme();
//        await RES.loadGroup("preload", 0);
//        await RES.loadGroup("game", 0);
//        //await RES.loadGroup("preload", 0, loadingView);
//        //this.stage.removeChild(loadingView);
//    }
//    catch (e) {
//        console.error(e);
//    }
//}
//
//    private loadTheme() {
//        return new Promise((resolve, reject) => {
//            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
//            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
//            let theme = new eui.Theme("resource/default.thm.json", this.stage);
//            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
//                resolve();
//            }, this);
//
//        })
//    }
//
//    private textfield: egret.TextField;
//    /**
//     * 创建场景界面
//     * Create scene interface
//     */
//    protected createGameScene(): void {
//        let sky = this.createBitmapByName("car_png");
//        this.addChild(sky);
//        let stageW = this.stage.stageWidth;
//        let stageH = this.stage.stageHeight;
//        sky.width = stageW;
//        sky.height = stageH;
//        console.log(111)
//
//        //let topMask = new egret.Shape();
//        //topMask.graphics.beginFill(0x000000, 0.5);
//        //topMask.graphics.drawRect(0, 0, stageW, 172);
//        //topMask.graphics.endFill();
//        //topMask.y = 33;
//        //this.addChild(topMask);
//        //
//        //let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
//        //this.addChild(icon);
//        //icon.x = 26;
//        //icon.y = 33;
//        //
//        //let line = new egret.Shape();
//        //line.graphics.lineStyle(2, 0xffffff);
//        //line.graphics.moveTo(0, 0);
//        //line.graphics.lineTo(0, 117);
//        //line.graphics.endFill();
//        //line.x = 172;
//        //line.y = 61;
//        //this.addChild(line);
//        //
//        //
//        //let colorLabel = new egret.TextField();
//        //colorLabel.textColor = 0xffffff;
//        //colorLabel.width = stageW - 172;
//        //colorLabel.textAlign = "center";
//        //colorLabel.text = "Hello Egret";
//        //colorLabel.size = 24;
//        //colorLabel.x = 172;
//        //colorLabel.y = 80;
//        //this.addChild(colorLabel);
//        //
//        //let textfield = new egret.TextField();
//        //this.addChild(textfield);
//        //textfield.alpha = 0;
//        //textfield.width = stageW - 172;
//        //textfield.textAlign = egret.HorizontalAlign.CENTER;
//        //textfield.size = 24;
//        //textfield.textColor = 0xffffff;
//        //textfield.x = 172;
//        //textfield.y = 135;
//        //this.textfield = textfield;
//        //
//        //let button = new eui.Button();
//        //button.label = "Click!";
//        //button.horizontalCenter = 0;
//        //button.verticalCenter = 0;
//        //this.addChild(button);
//        //button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
//    }
//    /**
//     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
//     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
//     */
//    private createBitmapByName(name: string): egret.Bitmap {
//        let result = new egret.Bitmap();
//        let texture: egret.Texture = RES.getRes(name);
//        result.texture = texture;
//        return result;
//    }
//
//
//}

var UM:UserManager,TM:TimeManager,EM:EventManager
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: MainLoadingUI;
    protected createChildren(): void {
        super.createChildren();

        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //this.stage.setContentSize(640,1136);

        //this.stage.addEventListener(egret.Event.RESIZE,this.setScaleMode,this);
        this.setScaleMode();
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = MainLoadingUI.getInstance();
        //if(_get['debug'] != 100 && _get['debug'] != 101)
        //{
        //    this.loadingView.show(this);
        //}


        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");



        UM = UserManager.getInstance();
        TM = TimeManager.getInstance();
        EM = EventManager.getInstance();
        Config.initURLRequest();

        if(_get['hide'])
            this.visible = false
    }

    private setScaleMode(){
        //if(this.stage.stageWidth/this.stage.stageHeight < 640/1136)
        //{
        //    this.stage.setContentSize(640,1136)
        //    this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        //}
        //else if(this.stage.stageWidth/this.stage.stageHeight > 640/960)
        //{
        //    this.stage.setContentSize(640,960)
        //    this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        //}
        //else
        //    this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }


    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);





        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("game");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;

        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "game") {

            this.isResourceLoadEnd = true;



            this.removeLoadEvent();
            this.createScene();
        }
        //else if (event.groupName == "preload_png") {
        //    RES.loadGroup("preload_jpg");//预加载第一阶段
        //}
        else if (event.groupName == "preload_png") {
            this.removeLoadEvent();
            this.createScene();
            RES.loadGroup("preload_jpg");
            RES.loadGroup("preload_png32")

        }
    }

    private removeLoadEvent(){
        this.loadingView.setFinish();
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    }
    private createScene(){
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "game") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        GameManager.stage = this.stage;
        GameManager.container = this;
        GameManager.getInstance().init();

        //GameUI.getInstance().show();
        var wx = window['wx'];
        if(!wx)
        {
            GameUI.getInstance().show();
            return;
        }

        UserManager.getInstance().getUserInfo(()=>{
            GameUI.getInstance().show();
        });




        //if(_get['hide'])
        //    return;
        //SoundManager.getInstance().preLoad();
        //var LM = LoginManager.getInstance();
        //if(SharedObjectManager.getInstance().getValue('change_user_gameid'))
        //{
        //    LoginManager.getInstance().loginServer2(SharedObjectManager.getInstance().getValue('change_user_gameid'))
        //    SharedObjectManager.getInstance().setValue('change_user_gameid',false)
        //}
        //else if(LM.quickPassword)
        //{
        //    this.loadingView.showLogin();
        //    LoginManager.getInstance().login(LM.lastUser,null)
        //}
        //else
        //{
        //    MyTool.removeMC(this.loadingView);
        //    egret.setTimeout(function(){
        //        RES.loadGroup("preload_png");//预加载第一阶段
        //        RES.loadGroup("preload_jpg");//预加载第一阶段
        //        RES.loadGroup("preload_png32");//预加载第一阶段
        //    },this,200)
        //    LoginUI.getInstance().show();
        //}

        //PKManager.getInstance().startPlay();


        //UM.fill({
        //    level:1,
        //    monster:[],
        //    skill:[],
        //    defend:[],
        //    atk:[],
        //    force:1
        //})
        //DefPosUI.getInstance().show(0)
        //PKManager.getInstance().startPlay();
        //MonsterTestUI.getInstance().show();
        //if(Config.isDebug && _get['host'] == 'com')
        //{
        //    Config.host = '172.17.196.195:90';
        //}
        //GameManager.stage = this.stage;
        //GameManager.container = this;
        //GameManager.getInstance().init();
        //SoundManager.getInstance().preLoad();
        //if(FromManager.getInstance().login())
        //    return;
        //
        //
        //if(_get['debug'] == 100)
        //{
        //    Net.getInstance().serverHost = 'http://172.17.196.195:90/gameindex.php';
        //    document.body.style.background='#FFFFFF'
        //    return
        //}
        //if(_get['debug'] == 101)
        //{
        //    GameManager.container.visible = false;
        //}
        //Config.isDebug =  _get['debug'] || SharedObjectManager.getInstance().getValue('debug_open');
        //var LM = LoginManager.getInstance();
        //if(!(LM.lastUser && LM.quickPassword && LM.lastServer)) {
        //    egret.setTimeout(function(){
        //        RES.loadGroup("preload_png");//预加载第一阶段
        //        RES.loadGroup("preload_jpg");//预加载第一阶段
        //    },this,200)
        //}


        //if(_get['openid2'])
        //{
        //    var arr = _get['openid2'].split('_')
        //    LoginManager.getInstance().getServerList(function(){
        //        LoginManager.getInstance().debugLoginServer(arr[1],arr[0],_get['openkey']);
        //    })
        //
        //    return;
        //}
        //
        //if(_get['openid'])
        //{
        //    LoginManager.getInstance().login(_get['openid'],'@password');
    }

    //private getUserInfo(){
    //    var wx = window['wx'];
    //    return new Promise((resolve, reject) => {
    //        let sysInfo = wx.getSystemInfoSync();
    //        let sdkVersion = sysInfo.SDKVersion;
    //        //sdkVersion = sdkVersion.replace(/\./g, "");
    //        //sdkVersion = sdkVersion.substr(0, 3);
    //        //let sdkVersionNum = parseInt(sdkVersion);
    //        //console.log("platform获取用户授权:", sdkVersionNum);
    //        //if (sdkVersionNum >= 201) {
    //        if (sdkVersion >= "2.0.1") {
    //            var button = wx.createUserInfoButton({
    //                type: 'image',
    //                text: '',
    //                image: "resource/game_assets/wx_btn_info.png",
    //                style: {
    //                    left: 0,
    //                    top: 0,
    //                    width: 0,
    //                    height: 0,
    //                    backgroundColor: '#ff0000',
    //                    color: '#ffffff',
    //                }
    //            });
    //            button.onTap((res) => {
    //                if (res.userInfo) {
    //                    console.log("用户授权:", res);
    //                    var userInfo = res.userInfo;
    //                    var nickName = userInfo.nickName;
    //                    var avatarUrl = userInfo.avatarUrl;
    //                    var gender = userInfo.gender; //性别 0：未知、1：男、2：女
    //                    var province = userInfo.province;
    //                    var city = userInfo.city;
    //                    var country = userInfo.country;
    //                    button.destroy();
    //                    resolve(userInfo);
    //                } else {
    //                    console.log("拒绝授权");
    //                }
    //            });
    //            button.show();
    //        } else {
    //            wx.getUserInfo({
    //                withCredentials: true,
    //                success: res => {
    //                    var userInfo = res.userInfo;
    //                    var nickName = userInfo.nickName;
    //                    var avatarUrl = userInfo.avatarUrl;
    //                    var gender = userInfo.gender; //性别 0：未知、1：男、2：女
    //                    var province = userInfo.province;
    //                    var city = userInfo.city;
    //                    var country = userInfo.country;
    //                    resolve(userInfo);
    //                },
    //                fail: res => {
    //                    wx.showModal({
    //                        title: '友情提醒',
    //                        content: '请允许微信获得授权!',
    //                        confirmText: "授权",
    //                        showCancel: false,
    //                        success: res => {
    //                            resolve(null);
    //                        }
    //                    });
    //                }
    //            });
    //        }
    //    })
    //}
}
