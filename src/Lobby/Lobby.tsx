import React from 'react';
import './Lobby.css';
import Player from "../player/Player";
import GameSocket, {PlayersUpdatedEvent, YouAreHostEvent} from "../gamesocket/GameSocket";

interface LobbyProps {
    socket: WebSocket;
}

interface LobbyState {
    players: Array<Player>;
    host: Boolean;
}

export default class Lobby extends React.Component<LobbyProps, LobbyState> {
    gameSocket: GameSocket;

    constructor(props: LobbyProps) {
        super(props);
        this.gameSocket = new GameSocket(props.socket);
        this.socketEvents(this.gameSocket);

        this.state = {
            players: [],
            host: false,
        }
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayersUpdated((e: PlayersUpdatedEvent) => {
            this.setState({players: e.players});
        })

        socket.onYouAreHost((e: YouAreHostEvent) => {
            this.setState({host: true});
        })
    }

    render() {
        return <div className={"Lobby"}>
            <h1>Lobby</h1>
            <h2>Spieler</h2>
            <ul>{this.state.players.map((p: Player, idx: number) => <li key={idx}>{p.name}</li>)}</ul>
            <button disabled={!this.state.host}
                    onClick={this.gameSocket.startGame}>
                Spiel starten
            </button>
        </div>;
    }
}
