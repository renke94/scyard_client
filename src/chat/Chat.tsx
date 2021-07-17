import React, {FormEvent} from "react";
import "./Chat.css"

interface ChatProps {

}

export default class Chat extends React.Component<ChatProps, any> {
    messagesEnd = React.createRef<HTMLDivElement>();

    constructor(props: ChatProps) {
        super(props);

        this.state = {
            messages: ["Henlo", "Fren"],
            input: "",
        }
    }

    onMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.input === "") return;
        const messages = this.state.messages.slice();
        messages.push(this.state.input);

        this.setState({
            input: "",
            messages: messages
        });
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
        return <div className={"Chat"} style={{backgroundImage: 'url("/board.png")'}}>
            <div className={"Messages"}>
                {this.state.messages.map((msg: string) => <p className={"Message"}>{msg}</p>)}
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
