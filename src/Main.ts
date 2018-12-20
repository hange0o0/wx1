var UM:UserManager,TM:TimeManager,EM:EventManager
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: MainLoadingUI;
    protected createChildren(): void {
        super.createChildren();
        console.log('_10')

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
        console.log('_1a')
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
        console.log('_1b')
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
        console.log('_1c')
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        console.log('_1d')
        if (event.groupName == "game") {

            this.isResourceLoadEnd = true;



            this.removeLoadEvent();
            this.createScene();
        }
        //else if (event.groupName == "preload_png") {
        //    RES.loadGroup("preload_jpg");//预加载第一阶段
        //}
        //else if (event.groupName == "preload_png") {
        //    this.removeLoadEvent();
        //    this.createScene();
        //    RES.loadGroup("preload_jpg");
        //    RES.loadGroup("preload_png32")
        //
        //}
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
        console.log(event.itemsLoaded, event.itemsTotal)
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
        console.log('_11')
        //GameUI.getInstance().show();
        var wx = window['wx'];
        if(!wx)
        {
            GameUI.getInstance().show();
            return;
        }
        console.log('_12')
        UserManager.getInstance().getUserInfo(()=>{
            GameUI.getInstance().show();
        });

    }
}
