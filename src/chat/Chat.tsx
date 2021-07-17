import React, {FormEvent} from "react";
import "./Chat.css"
import {PlayerMessageEvent} from "../gamesocket/GameSocket";

interface ChatProps {
    messages: Array<PlayerMessageEvent>;
    onMessageSend: (msg: string) => void;
}

export default class Chat extends React.Component<ChatProps, any> {
    messagesEnd = React.createRef<HTMLDivElement>();

    constructor(props: ChatProps) {
        super(props);

        this.state = {
            input: "",
        }
    }

    onMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.input === "") return;
        this.props.onMessageSend(this.state.input);
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
                {this.props.messages.map((e: PlayerMessageEvent, idx: number) => <Message e={e} key={idx}/>)}
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
    const date = new Date(props.e.timestamp).toLocaleString().split(',')[1].trim();

    return <div className={"Message"}>
        <p className={"MessageTime"}>[{date}]</p>
        <p className={"MessageSender"}><i>{props.e.sender}:</i></p>
        <p className={"MessageBody"}>{props.e.message}</p>
    </div>
}


