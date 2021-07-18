import Player from "../player/Player";
import Move from "../move/Move";

export default class GameSocket {
    private socket: WebSocket;

    /**
     * Actions to be executed on a corresponding event are stored here.
     */
    private playersUpdatedActions: Array<(e: PlayersUpdatedEvent) => void> = [];
    private youAreHostActions: Array<(e: YouAreHostEvent) => void> = [];
    private gameStartedActions: Array<(e: GameStartedEvent) => void> = [];
    private gameReadyStateActions: Array<(e: GameReadyStateChangedEvent) => void> = [];
    private playerUpdateActions: Array<(e: PlayerUpdatedEvent) => void> = [];
    private selfUpdateActions: Array<(e: SelfUpdatedEvent) => void> = [];
    private messageActions: Array<(e: PlayerMessageEvent) => void> = [];
    private illegalMoveActions: Array<(e: IllegalMoveEvent) => void> = [];

    private playersUpdated = (data: any) => {
        const event = new PlayersUpdatedEvent(data);
        this.playersUpdatedActions.forEach(action => action(event));
    }

    private hostChanged = (data: any) => {
        const event = new YouAreHostEvent(data);
        this.youAreHostActions.forEach(action => action(event));
    }

    private gameStarted = (data: any) => {
        const event = new GameStartedEvent(data);
        this.gameStartedActions.forEach(action => action(event));
    }

    private gameReadyStateChanged = (data: any) => {
        const event = new GameReadyStateChangedEvent(data);
        this.gameReadyStateActions.forEach(action => action(event));
    }

    private updatePlayer = (data: any) => {
        const event = new PlayerUpdatedEvent(data);
        this.playerUpdateActions.forEach(action => action(event));
    }

    private updateSelf = (data: any) => {
        const event = new SelfUpdatedEvent(data);
        this.selfUpdateActions.forEach(action => action(event));
    }

    private message = (data: any) => {
        const event = new PlayerMessageEvent(data);
        this.messageActions.forEach(action => action(event));
    }

    private illegalMove = (data: any) => {
        const event = new IllegalMoveEvent(data);
        this.illegalMoveActions.forEach(action => action(event))
    }

    /**
     * The eventMapper determines the type of the incoming event.
     */
    private eventMapper = new Map([
        ["playersUpdate", this.playersUpdated],
        ["youAreHost", this.hostChanged],
        ["gameStarted", this.gameStarted],
        ["gameReadyStateChanged", this.gameReadyStateChanged],
        ["updatePlayer", this.updatePlayer],
        ["updateSelf", this.updateSelf],
        ["messageEvent", this.message],
        ["illegalMove", this.illegalMove],
    ]);

    constructor(name: string) {
        this.socket = new WebSocket(`ws://localhost:7000/${name}`);
        this.socket.onmessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            const action = this.eventMapper.get(data.type);
            if (action === undefined) {
                console.log(`event: ${data.type} not implemented`);
                return;
            }

            action!(data);
        }
    }

    /**
     * Events:
     * To register an action to a corresponding event, call on of this methods with a callback.
     * @param action: callback function, that will be executed, when the corresponding event is fired.
     */
    onPlayersUpdated(action: (e: PlayersUpdatedEvent) => void) {
        this.playersUpdatedActions.push(action);
    }

    onYouAreHost(action: (e: YouAreHostEvent) => void) {
        this.youAreHostActions.push(action);
    }

    onConnect(action: (e: Event) => void) {
        this.socket.onopen = action;
    }

    onDisconnect(action: (e: CloseEvent) => void) {
        this.socket.onclose = action;
    }

    onGameStarted(action: (e: GameStartedEvent) => void) {
        this.gameStartedActions.push(action);
    }

    onGameReadyStateChanged(action: (e: GameReadyStateChangedEvent) => void) {
        this.gameReadyStateActions.push(action);
    }

    onPlayerUpdated(action: (e: PlayerUpdatedEvent) => void) {
        this.playerUpdateActions.push(action);
    }

    onSelfUpdated(action: (e: SelfUpdatedEvent) => void) {
        this.selfUpdateActions.push(action);
    }

    onMessage(action: (e: PlayerMessageEvent) => void) {
        this.messageActions.push(action);
    }

    onIllegalMove(action: (e: IllegalMoveEvent) => void) {
        this.illegalMoveActions.push(action);
    }

    /**
     * Commands:
     */
    private sendEvent = (event: Event) => {
        this.socket.send(JSON.stringify(event));
    }

    startGame = () => {
        this.sendEvent(new StartGameEvent());
    }

    sendMove = (move: Move) => {
        this.sendEvent(new MoveEvent(move));
    }

    sendMessage = (msg: string) => {
        const messageEvent = new PlayerMessageEvent({
            message: msg,
            timestamp: new Date(),
            sender: ""
        });
        this.sendEvent(messageEvent);
    }

    disconnect = () => {
        this.socket.close();
    }
}

export class Event {
    type: string;

    constructor(type: string) {
        this.type = type;
        console.log(this.type);
    }
}

export class PlayersUpdatedEvent extends Event {
    players: Array<Player>;

    constructor(jsonObject: any) {
        super(jsonObject.type);
        this.players = jsonObject.players.map((p: any) => new Player(p.name, p.uuid));
    }
}

export class YouAreHostEvent extends Event {
    constructor(jsonObject: any) {
        super(jsonObject.type);
    }
}

class StartGameEvent extends Event {
    constructor() {
        super("hostStartedTheGame");
    }
}

class MoveEvent extends Event {
    move: Move;

    constructor(move: Move) {
        super("moveEvent");
        this.move = move;
    }
}

export class GameReadyStateChangedEvent extends Event {
    isReady: Boolean;

    constructor(jsonObject: any) {
        super("gameReadyStateChanged");
        this.isReady = jsonObject.isReady;
    }
}

export class GameStartedEvent extends Event {
    gameInfo : GameInfo;

    constructor(jsonObject: any) {
        super("gameStarted");
        this.gameInfo = jsonObject.gameInfo;
    }
}

export class PlayerUpdatedEvent extends Event {
    playerInfo : PlayerInfo;

    constructor(jsonObject: any) {
        super("updatePlayer");
        this.playerInfo = jsonObject.playerInfo;
    }
}

export class SelfUpdatedEvent extends Event {
    selfInfo : SelfInfo;

    constructor(jsonObject: any) {
        super("updateSelf");
        this.selfInfo = jsonObject.selfInfo;
        console.log(this.selfInfo);
    }
}

export class PlayerMessageEvent extends Event {
    message: string;
    timestamp: number;
    sender: string;

    constructor(jsonObject: any) {
        super("messageEvent");
        this.message = jsonObject.message;
        this.timestamp = jsonObject.timestamp;
        this.sender = jsonObject.sender;
    }
}

class IllegalMoveEvent extends Event {
    msg: string

    constructor(data: any) {
        super("illegalMove");
        this.msg = data.msg;
    }
}

export interface Tickets {
    TAXI  : number;
    BUS   : number;
    TRAIN : number;
    BLACK : number;
}

export interface PlayerInfo {
    player  : Player;
    tickets : Tickets;
    station : number;
    color   : string;
}

export interface SelfInfo extends PlayerInfo {
    reachableStations: ReachableStations;
    isMisterX: Boolean;
}

export interface ReachableStations {
    TAXI  : Array<number>;
    BUS   : Array<number>;
    TRAIN : Array<number>;
    BLACK : Array<number>;
}

export interface GameInfo {
    detectives: Array<PlayerInfo>;
    misterX: Player;
    misterXLastSeen: string;
}
