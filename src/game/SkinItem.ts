class SkinItem extends game.BaseItem{

    private bg: eui.Image;
    private carMC: eui.Image;
    private desText: eui.Label;
    private rateText: eui.Label;
    private barMC: eui.Image;
    private btn: eui.Button;
    private usingMC: eui.Image;

    public constructor() {
        super();
        this.skinName = "SkinItemSkin";
    }

    public childrenCreated() {

    }

    public dataChanged():void{

    }
}