import React, {FormEvent} from "react";
import "./Chat.css"
import GameSocket, {PlayerMessageEvent} from "../gamesocket/GameSocket";

interface ChatProps {
    socket: GameSocket;
}

interface ChatState {
    messages : Array<PlayerMessageEvent>;
    input    : string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    messagesEnd = React.createRef<HTMLDivElement>();

    constructor(props: ChatProps) {
        super(props);

        this.state = {
            messages : [],
            input    : "",
        }


        this.props.socket.onMessage((e: PlayerMessageEvent) => {
            const messages = this.state.messages;
            messages.push(e);
            this.setState({messages: messages});
        })
    }

    onMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.input === "") return;
        this.props.socket.sendMessage(this.state.input);
        this.setState({input: ""});
    }

    scrollToBottom = () => {
        this.messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return <div className={"Chat"}>
            <div className={"Messages"}>
                {this.state.messages.map((e: PlayerMessageEvent, idx: number) => <Message e={e} key={idx}/>)}
                <div ref={this.messagesEnd}/>
            </div>
            <form
                className={"ChatInputForm"}
                action="submit"
                onSubmit={this.onMessage}>
                <input
                    value={this.state.input}
                    onChange={(e) => this.setState({input: e.target.value})}
                    className={"ChatInput"}
                    type="text"
                    placeholder={"Message"}
                />
            </form>
        </div>;
    }
}

interface MessageProps {
    e: PlayerMessageEvent;
}

function Message(props: MessageProps) {
    const date = new Date(props.e.data.date).toLocaleString().split(',')[1].trim();

    return <div className={"Message"}>
        <p className={"MessageTime"}>[{date}]</p>
        <p className={"MessageSender"}><i>{props.e.data.sender}:</i></p>
        <p className={"MessageBody"}>{props.e.message}</p>
    </div>
}


