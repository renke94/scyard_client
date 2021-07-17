import React from 'react';
import './Lobby.css';
import Player from "../player/Player";
import GameSocket, {
    GameReadyStateChangedEvent,
    PlayerInfo, PlayerMessageEvent,
    PlayersUpdatedEvent,
    PlayerUpdatedEvent, SelfInfo, SelfUpdatedEvent,
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
    selfInfo: SelfInfo | undefined;
    players: Map<string, PlayerInfo>;
    messages: Array<PlayerMessageEvent>;
}

export default class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);

        this.state = {
            playersList: [],
            host: false,
            isReady: false,
            selfInfo: undefined,
            players: new Map<string, PlayerInfo>(),
            messages: [],
        }
    }

    componentDidMount() {
        this.socketEvents(this.props.socket);
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayersUpdated((e: PlayersUpdatedEvent) => {
            this.setState({playersList: e.players});
        })

        socket.onYouAreHost((e: YouAreHostEvent) => {
            this.setState({host: true});
        })

        socket.onGameReadyStateChanged((e: GameReadyStateChangedEvent) => {
            this.setState({isReady: e.isReady});
        })

        socket.onPlayerUpdated((e: PlayerUpdatedEvent) => {
            const players = this.state.players;
            players.set(e.playerInfo.player.uuid, e.playerInfo);
            this.setState({players: players});
        });

        socket.onSelfUpdated((e: SelfUpdatedEvent) => {
            this.setState({ selfInfo: e.selfInfo });
        });

        socket.onMessage((e: PlayerMessageEvent) => {
            const messages = this.state.messages;
            messages.push(e);
            this.setState({messages: messages});
        })
    }

    render() {
        return <div>
            {this.state.selfInfo ?
                <Game
                    socket={this.props.socket}
                    selfInfo={this.state.selfInfo}
                    players={this.state.players}
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
            <Chat messages={this.state.messages} onMessageSend={this.props.socket.sendMessage}/>
        </div>;
    }
}
