import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import './App.css';
import Login from "./login/Login";
import Lobby from "./Lobby/Lobby";
import GameSocket from "./gamesocket/GameSocket";

interface AppState {
    socket: GameSocket | undefined;
}

class App extends React.Component<any, AppState> {
    state = {
        socket: undefined
    }

    onLogin = (name: string) => {
        const socket = new GameSocket(name);

        socket.onConnect((e) => {
            this.setState({socket: socket});
        });

        socket.onDisconnect((ev: CloseEvent) => {
            this.setState({socket: undefined});
        });
    }

    onLogout = () => {
        const socket: GameSocket = this.state.socket!!;
        socket.disconnect();
    }

    render() {
        return <div>
            {this.state.socket ?
                <Lobby socket={this.state.socket!} onLogout={this.onLogout}/> :
                <Login onLogin={this.onLogin}/>}
        </div>;
    }
}

export default App;
