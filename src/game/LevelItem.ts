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
        if(this.currentState == 'current')
        {
            LevelUI.getInstance().hide();
            GameUI.getInstance().startLevel(this.data)
        }
    }

    public dataChanged():void{
         this.indexText.text = this.data;
        var star = CarManager.getInstance().getLevelStar(this.data)
        if(star || this.data == CarManager.getInstance().maxLevel + 1)
        {
            this.currentState = 'current'
            for(var i=0;i<3;i++)
            {
                 this['s' + i].source = i<star?'chapter_star4_png':'chapter_star3_png'
            }
        }
        else
        {
            this.currentState = 'lock'
        }

    }
}