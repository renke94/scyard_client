import React from 'react';
import './Lobby.css';
import Player from "../player/Player";
import GameSocket, {
    GameReadyStateChangedEvent,
    GameStartedEvent,
    Message, PlayerMessageEvent,
    UpdatePlayersEvent,
    YouAreHostEvent
} from "../gamesocket/GameSocket";
import Game from "../game/Game";
import Chat from "../chat/Chat";

interface LobbyProps {
    socket: GameSocket;
    onLogout: () => void;
}

interface LobbyState {
    playersList: Array<Player>;
    host: Boolean;
    isReady: Boolean;
    gameStarted: Boolean
    messages: Array<Message>;
}

export default class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);

        this.state = {
            playersList: [],
            host: false,
            isReady: false,
            gameStarted: false,
            messages: [],
        }
    }

    componentDidMount() {
        this.socketEvents(this.props.socket);
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayersUpdated((e: UpdatePlayersEvent) => {
            this.setState({playersList: e.data});
        })

        socket.onYouAreHost((e: YouAreHostEvent) => {
            this.setState({host: true});
        })

        socket.onGameReadyStateChanged((e: GameReadyStateChangedEvent) => {
            this.setState({isReady: e.data});
        })

        socket.onGameStarted((e: GameStartedEvent) => {
            this.setState({gameStarted: true});
        })

        socket.onMessage((e: PlayerMessageEvent) => this.onMessage(e.data))
    }

    onMessage = (msg: Message) => {
        const messages = this.state.messages;
        messages.push(msg);
        this.setState({messages: messages});
    }

    render() {
        return <div>
            {this.state.gameStarted ?
                <Game
                    socket={this.props.socket}
                    onMessage={this.onMessage}
                /> :
                <div className={"Lobby"}>
                    <h1>Lobby</h1>
                    <h2>Spieler</h2>
                    <ul>
                        {this.state.playersList.map((p: Player, idx: number) => <li key={idx}>{p.name}</li>)}
                    </ul>
                    <button
                        disabled={!this.state.host || !this.state.isReady}
                        onClick={this.props.socket.startGame}
                    >Spiel starten</button>
                    <button onClick={this.props.onLogout}>Logout</button>
                </div>}
            <Chat messages={this.state.messages} onMessage={((msg: string) => {
                this.props.socket.sendMessage(msg);
            })}/>
        </div>;
    }
}
