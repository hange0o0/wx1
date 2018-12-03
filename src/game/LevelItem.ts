class LevelItem extends game.BaseItem{

    private indexText: eui.Label;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;


    public constructor() {
        super();
        this.skinName = "LevelItemSkin";
    }

    public childrenCreated() {
          this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        LevelUI.getInstance().hide();
        GameUI.getInstance().startLevel(this.data)
    }

    public dataChanged():void{
         this.indexText.text = this.data;
        this.currentState = 'current'
    }
}