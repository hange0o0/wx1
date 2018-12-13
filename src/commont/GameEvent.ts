
class GameEvent {
    public static client = {
        SKIN_CHANGE:'SKIN_CHANGE',
        INFO_CHANGE:'INFO_CHANGE',

        red_change:'red_change',
        pass_day:'pass_day',
        timer:'timer'
    };

    public static sys = {
        login:'login',

        client_error:'sys.client_error'
    }

    public static game = {
        buy_skin:'game.buy_skin',
        create_rank:'rank.create_rank',
        get_rank2:'rank.get_rank2'
    }


    public static rank = {
        get_rank:'rank.get_rank',
        create_rank:'rank.create_rank',
        get_rank2:'rank.get_rank2'
    }


}