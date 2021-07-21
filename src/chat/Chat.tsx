import React, {FormEvent} from "react";
import "./Chat.css"
import {Message} from "../gamesocket/GameSocket";

interface ChatProps {
    messages  : Array<Message>;
    onMessage : (msg: Message) => void;
}

interface ChatState {
    input    : string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    messagesEnd = React.createRef<HTMLDivElement>();

    constructor(props: ChatProps) {
        super(props);

        this.state = {
            input    : "",
        }
    }

    onMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.input === "") return;
        this.props.onMessage({
            text   : this.state.input,
            sender : "",
            date   : new Date()
        })
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
                {this.props.messages.map((msg: Message, idx: number) => <MessageComponent message={msg} key={idx}/>)}
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
    message: Message;
}

function MessageComponent(props: MessageProps) {
    const date = new Date(props.message.date).toLocaleString().split(',')[1].trim();

    return <div className={"Message"}>
        <p className={"MessageTime"}>[{date}]</p>
        <p className={"MessageSender"}><i>{props.message.sender}:</i></p>
        <p className={"MessageBody"}>{props.message.text}</p>
    </div>
}


