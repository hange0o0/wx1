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

    }

    public dataChanged():void{

    }
}