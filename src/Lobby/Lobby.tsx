import React from 'react';
import './Lobby.css';
import Player from "../player/Player";
import GameSocket, {
    GameInfo,
    GameReadyStateChangedEvent,
    GameStartedEvent, MisterXUpdatedEvent, PlayerInfo,
    PlayersUpdatedEvent,
    YouAreHostEvent
} from "../gamesocket/GameSocket";
import Game from "../game/Game";

interface LobbyProps {
    socket: GameSocket;
    onLogout: () => void;
}

interface LobbyState {
    players: Array<Player>;
    host: Boolean;
    isReady: Boolean;
    gameInfo: GameInfo | undefined;
    misterXInfo: PlayerInfo | undefined;
}

export default class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);

        this.state = {
            players: [],
            host: false,
            isReady: false,
            gameInfo: undefined,
            misterXInfo: undefined
        }
    }

    componentDidMount() {
        this.socketEvents(this.props.socket);
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayersUpdated((e: PlayersUpdatedEvent) => {
            this.setState({players: e.players});
        })

        socket.onYouAreHost((e: YouAreHostEvent) => {
            this.setState({host: true});
        })

        socket.onGameStarted((e: GameStartedEvent) => {
            this.setState({gameInfo: e.gameInfo});
        })

        socket.onGameReadyStateChanged((e: GameReadyStateChangedEvent) => {
            this.setState({isReady: e.isReady});
        })

        socket.onMisterXUpdated((e: MisterXUpdatedEvent) => {
            this.setState({misterXInfo: e.playerInfo});
        })
    }

    render() {
        return <div>
            {this.state.gameInfo ?
                <Game socket={this.props.socket} gameInfo={this.state.gameInfo} misterXInfo={this.state.misterXInfo}/> :
                <div className={"Lobby"}>
                    <h1>Lobby</h1>
                    <h2>Spieler</h2>
                    <ul>{this.state.players.map((p: Player, idx: number) => <li key={idx}>{p.name}</li>)}</ul>
                    <button disabled={!this.state.host || !this.state.isReady}
                            onClick={this.props.socket.startGame}>Spiel starten</button>
                    <button onClick={this.props.onLogout}>Logout</button>
                </div>}
        </div>;
    }
}
