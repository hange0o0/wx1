class CarManager {
    private static instance:CarManager;
    public static getInstance():CarManager {
        if (!this.instance)
            this.instance = new CarManager();
        return this.instance;
    }

    public constructor() {

    }

    public maxLevel = _get['level'] || 1;


}