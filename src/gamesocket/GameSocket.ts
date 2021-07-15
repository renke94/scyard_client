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

    private playersUpdated = (data: any) => {
        const event = new PlayersUpdatedEvent(data);
        this.playersUpdatedActions.forEach(action => action(event));
    }

    private hostChanged = (data: any) => {
        const event = new YouAreHostEvent(data);
        this.youAreHostActions.forEach(action => action(event));
    }

    private gameStarted = (data: any) => {
        const event = new GameStartedEvent();
        this.gameStartedActions.forEach(action => action(event));
    }

    /**
     * The eventMapper determines the type of the incoming event.
     */
    private eventMapper = new Map([
        ["playersUpdate", this.playersUpdated],
        ["youAreHost", this.hostChanged],
        ["gameStarted", this.gameStarted],
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
        this.gameStartedActions.push(action)
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

    disconnect = () => {
        this.socket.close();
    }
}

export class Event {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

export class PlayersUpdatedEvent extends Event {
    players: Array<Player>;

    constructor(jsonObject: any) {
        super(jsonObject.type);
        this.players = jsonObject.players.map((p: any) => new Player(p.name));
    }
}

export class YouAreHostEvent extends Event {
    constructor(jsonObject: any) {
        super(jsonObject.type);
    }
}

class StartGameEvent extends Event {
    constructor() {
        super("startGame");
    }
}

class MoveEvent extends Event {
    move: Move;

    constructor(move: Move) {
        super("moveEvent");
        this.move = move;
    }
}

export class GameStartedEvent extends Event {
    constructor() {
        super("gameStarted");
    }
}
