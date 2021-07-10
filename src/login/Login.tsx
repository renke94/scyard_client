import React from 'react';
import './Login.css';

interface LoginProps {
    onLogin: (name: string) => void;
}

interface LoginState {
    name: string;
}

export default class Login extends React.Component<LoginProps, LoginState> {
    state = {
        name: ""
    }

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.name.length < 3) {
            alert("Name ist zu kurz!");
            return;
        }
        this.props.onLogin(this.state.name);
    }


    render() {
        return <form className="LoginForm" action="submit" onSubmit={this.onSubmit}>
            <h1>Login</h1>
            <input className="LoginInput" type="text" placeholder="Name"
                   value={this.state.name}
                   onChange={e => this.setState({name: e.currentTarget.value})}/>
            <button className="LoginButton">Verbinden</button>
        </form>;
    }
}
