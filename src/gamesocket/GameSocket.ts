import Player from "../player/Player";

export default class GameSocket {
    private socket: WebSocket;

    /**
     * Actions to be executed on a corresponding event are stored here.
     */
    private playersUpdatedActions: Array<(e: PlayersUpdatedEvent) => void> = [];
    private youAreHostActions: Array<(e: YouAreHostEvent) => void> = [];

    private playersUpdated = (data: any) => {
        const event = new PlayersUpdatedEvent(data);
        this.playersUpdatedActions.forEach(action => action(event));
    }

    private hostChanged = (data: any) => {
        const event = new YouAreHostEvent(data);
        this.youAreHostActions.forEach(action => action(event));
    }

    /**
     * The eventMapper determines the type of the incoming event.
     */
    private eventMapper = new Map([
        ["playersUpdate", this.playersUpdated],
        ["youAreHost", this.hostChanged]
    ]);

    constructor(socket: WebSocket) {
        this.socket = socket;
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

    /**
     * Commands:
     */
    private sendEvent = (event: Event) => {
        this.socket.send(JSON.stringify(event));
    }

    startGame = () => {
        this.sendEvent(new StartGameEvent());
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
