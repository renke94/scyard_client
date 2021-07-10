export default interface PlayerInfo {
    name      : string;
    station   : number;
    color     : string;
    isMisterX : boolean;
    tickets   : {
        taxi  : number;
        bus   : number;
        train : number;
        black : number;
    }
}
