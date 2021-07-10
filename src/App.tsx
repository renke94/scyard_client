import React from 'react';
import './App.css';
import Login from "./login/Login";
import Lobby from "./Lobby/Lobby";

interface AppState {
    socket: WebSocket | undefined;
}

class App extends React.Component<any, AppState> {
    state = {
        socket: undefined
    };

    onLogin = (name: string) => {
        const socket = new WebSocket(`ws://localhost:7000/${name}`);
        this.socketEvents(socket);
    }

    onLogout = () => {
        const socket: WebSocket = this.state.socket!!;
        socket.close();
    }

    socketEvents = (socket: WebSocket) => {
        socket.onopen = (ev: Event) => {
            this.setState({socket: socket});
        };

        socket.onclose = (ev: CloseEvent) => {
            this.setState({socket: undefined});
        };
    }

    render() {
        return this.state.socket
            ? <div>
                <button onClick={this.onLogout}>Logout</button>
                <Lobby socket={this.state.socket!!}/>
            </div>
            : <Login onLogin={this.onLogin}/>;
    }
}

export default App;
