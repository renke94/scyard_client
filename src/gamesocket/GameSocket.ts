import Player from "../player/Player";
import Move from "../move/Move";

export default class GameSocket {
    private socket: WebSocket;

    /**
     * Actions to be executed on a corresponding event are stored here.
     */
    private playersUpdatedActions   : Array<(e: UpdatePlayersEvent)         => void> = [];
    private youAreHostActions       : Array<(e: YouAreHostEvent)            => void> = [];
    private gameStartedActions      : Array<(e: GameStartedEvent)           => void> = [];
    private gameReadyStateActions   : Array<(e: GameReadyStateChangedEvent) => void> = [];
    private playerUpdateActions     : Array<(e: UpdatePlayerInfoEvent)      => void> = [];
    private selfUpdateActions       : Array<(e: UpdateSelfInfoEvent)        => void> = [];
    private messageActions          : Array<(e: PlayerMessageEvent)         => void> = [];
    private illegalMoveActions      : Array<(e: IllegalMoveEvent)           => void> = [];
    private nextRoundActions        : Array<(e: NextRoundEvent)             => void> = [];
    private yourTurnActions         : Array<(e: YourTurnEvent)              => void> = [];
    private misterXMovedActions     : Array<(e: MisterXMovedEvent)          => void> = [];
    private misterXWasSeenActions   : Array<(e: MisterXWasSeenEvent)        => void> = [];
    private misterXWasCaughtActions : Array<(e: MisterXWasCaughtEvent)      => void> = [];
    private misterXEscapedActions   : Array<(e: MisterXEscapedEvent)        => void> = [];

    private playersUpdated = (data: any) => {
        this.playersUpdatedActions.forEach(action => action(data));
    }

    private hostChanged = (data: any) => {
        this.youAreHostActions.forEach(action => action(data));
    }

    private gameStarted = (data: any) => {
        this.gameStartedActions.forEach(action => action(data));
    }

    private gameReadyStateChanged = (data: any) => {
        this.gameReadyStateActions.forEach(action => action(data));
    }

    private updatePlayer = (data: any) => {
        this.playerUpdateActions.forEach(action => action(data));
    }

    private updateSelf = (data: any) => {
        this.selfUpdateActions.forEach(action => action(data));
    }

    private message = (data: any) => {
        this.messageActions.forEach(action => action(data));
    }

    private illegalMove = (data: any) => {
        this.illegalMoveActions.forEach(action => action(data))
    }

    private nextRound = (data: any) => {
        this.nextRoundActions.forEach(action => action(data))
    }

    private yourTurn = (data: any) => {
        this.yourTurnActions.forEach(action => action(data))
    }

    private misterXMoved = (data: any) => {
        this.misterXMovedActions.forEach(action => action(data))
    }

    private misterXWasSeen = (data: any) => {
        this.misterXWasSeenActions.forEach(action => action(data))
    }

    private misterXWasCaught = (data: any) => {
        this.misterXWasCaughtActions.forEach(action => action(data))
    }

    private misterXEscaped = (data: any) => {
        this.misterXEscapedActions.forEach(action => action(data))
    }

    /**
     * The eventMapper determines the type of the incoming event.
     */
    private eventMapper = new Map([
        ["YouAreHostEvent", this.hostChanged],
        ["UpdatePlayersEvent", this.playersUpdated],
        ["GameReadyStateChangedEvent", this.gameReadyStateChanged],
        ["GameStartedEvent", this.gameStarted],
        ["UpdatePlayerInfoEvent", this.updatePlayer],
        ["UpdateSelfInfoEvent", this.updateSelf],
        ["MessageEvent", this.message],
        ["IllegalMoveEvent", this.illegalMove],
        ["NextRoundEvent", this.nextRound],
        ["YourTurnEvent", this.yourTurn],
        ["MisterXMovedEvent", this.misterXMoved],
        ["MisterXWasSeenEvent", this.misterXWasSeen],
        ["MisterXWasCaughtEvent", this.misterXWasCaught],
        ["MisterXEscapedEvent", this.misterXEscaped],
    ]);

    constructor(name: string) {
        this.socket = new WebSocket(`ws://localhost:7000/${name}`);
        this.socket.onmessage = (e: MessageEvent) => {
            const json = JSON.parse(e.data);
            const action = this.eventMapper.get(json.type);
            if (action === undefined) {
                console.log(`event: ${json.type} not implemented`);
                return;
            }

            action!(json);
        }
    }

    /**
     * Events:
     * To register an action to a corresponding event, call on of this methods with a callback.
     * @param action: callback function, that will be executed, when the corresponding event is fired.
     */
    onPlayersUpdated(action: (e: UpdatePlayersEvent) => void) {
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

    onPlayerUpdated(action: (e: UpdatePlayerInfoEvent) => void) {
        this.playerUpdateActions.push(action);
    }

    onSelfUpdated(action: (e: UpdateSelfInfoEvent) => void) {
        this.selfUpdateActions.push(action);
    }

    onMessage(action: (e: PlayerMessageEvent) => void) {
        this.messageActions.push(action);
    }

    onIllegalMove(action: (e: IllegalMoveEvent) => void) {
        this.illegalMoveActions.push(action);
    }

    onNextRound(action: (e: NextRoundEvent) => void) {
        this.nextRoundActions.push(action);
    }

    onYourTurn(action: (e: YourTurnEvent) => void) {
        this.yourTurnActions.push(action);
    }

    onMisterXMoved(action: (e: MisterXMovedEvent) => void) {
        this.misterXMovedActions.push(action);
    }

    onMisterXWasSeen(action: (e: MisterXWasSeenEvent) => void) {
        this.misterXWasSeenActions.push(action);
    }

    onMisterXWasCaught(action: (e: MisterXWasCaughtEvent) => void) {
        this.misterXWasCaughtActions.push(action);
    }

    onMisterXEscaped(action: (e: MisterXEscapedEvent) => void) {
        this.misterXEscapedActions.push(action);
    }


    /**
     * Commands:
     */
    private sendEvent = (event: ScyEvent) => {
        this.socket.send(JSON.stringify(event));
    }

    startGame = () => {
        this.sendEvent({
            type    : "StartGameEvent",
            message : ""
        });
    }

    clientReady = () => {
        this.sendEvent({
            type    : "ClientReadyEvent",
            message : ""
        })
    }

    sendMove = (move: Move) => {
        const event : MoveEvent = {
            type    : "MoveEvent",
            message : "",
            data    : move
        };

        this.sendEvent(event);
    }

    sendMessage = (msg: string) => {
        const event : PlayerMessageEvent = {
            type    : "MessageEvent",
            message : msg,
            data    : {
                text   : msg,
                sender : "",
                date   : new Date(),
            }
        };
        this.sendEvent(event);
    }

    disconnect = () => {
        this.socket.close();
    }
}

export interface ScyEvent {
    type    : string;
    message : string;
}

export interface UpdatePlayersEvent extends ScyEvent {
    data: Array<Player>;
}

export interface YouAreHostEvent extends ScyEvent {}

export interface GameStartedEvent extends ScyEvent {}

export interface ClientReadyEvent extends ScyEvent {}

export interface GameReadyStateChangedEvent extends ScyEvent {
    data : Boolean;
}

interface MoveEvent extends ScyEvent {
    data : Move;
}

export interface UpdatePlayerInfoEvent extends ScyEvent {
    data : Array<PlayerInfo>;
}

export interface UpdateSelfInfoEvent extends ScyEvent {
    data : PlayerInfo;
}

export interface PlayerMessageEvent extends ScyEvent {
    data : Message;
}

export interface IllegalMoveEvent extends ScyEvent {
    data : Move;
}

export interface NextRoundEvent extends ScyEvent {
    data : number;
}

export interface YourTurnEvent extends ScyEvent {}

export interface MisterXMovedEvent extends ScyEvent {}

export interface MisterXWasSeenEvent extends ScyEvent {
    data : PlayerInfo;
}

export interface MisterXWasCaughtEvent extends ScyEvent {
    data: PlayerInfo;
}

export interface MisterXEscapedEvent extends ScyEvent {}

export interface Message {
    text   : string;
    sender : string;
    date   : Date;
}

export interface Tickets {
    taxi  : number;
    bus   : number;
    train : number;
    black : number;
}

export interface PlayerInfo {
    uuid              : string;
    name              : string;
    color             : string;
    station           : number;
    tickets           : Tickets;
    isMisterX         : Boolean;
    reachableStations : ReachableStations;
}

export interface ReachableStations {
    taxi  : Array<number>;
    bus   : Array<number>;
    train : Array<number>;
    black : Array<number>;
}
