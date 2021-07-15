import React from 'react';
import './Lobby.css';
import Player from "../player/Player";
import GameSocket, {GameStartedEvent, PlayersUpdatedEvent, YouAreHostEvent} from "../gamesocket/GameSocket";
import Game from "../game/Game";

interface LobbyProps {
    socket: GameSocket;
    onLogout: () => void;
}

interface LobbyState {
    players: Array<Player>;
    host: Boolean;
    gameStarted: Boolean;
}

export default class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);
        this.socketEvents(this.props.socket);

        this.state = {
            players: [],
            host: false,
            gameStarted: false,
        }
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayersUpdated((e: PlayersUpdatedEvent) => {
            this.setState({players: e.players});
        })

        socket.onYouAreHost((e: YouAreHostEvent) => {
            this.setState({host: true});
        })

        socket.onGameStarted((e: GameStartedEvent) => {
            this.setState({gameStarted: true});
        })
    }

    render() {
        return <div>
            {this.state.gameStarted ?
                <Game socket={this.props.socket}/> :
                <div className={"Lobby"}>
                    <h1>Lobby</h1>
                    <h2>Spieler</h2>
                    <ul>{this.state.players.map((p: Player, idx: number) => <li key={idx}>{p.name}</li>)}</ul>
                    <button disabled={!this.state.host}
                            onClick={this.props.socket.startGame}>Spiel starten</button>
                    <button onClick={this.props.onLogout}>Logout</button>
                </div>}
        </div>;
    }
}
