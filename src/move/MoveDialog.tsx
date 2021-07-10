import React from "react";
import Move from "./Move";
import PlayerInfo from "../player/PlayerInfo";
import './MoveDialog.css';

interface MoveDialogProps {
    targetStation : number;
    playerInfo    : PlayerInfo;
    onTicketSelect: (move: Move) => void;
}

export default class MoveDialog extends React.Component<MoveDialogProps, any> {
    render() {
        return (
            <div className={"MoveDialog"} style={{width: this.props.playerInfo.isMisterX ? 480 : 360}}>
                <h1>Choose Ticket</h1>
                <div className={"MoveDialogTickets"}>
                    <div>
                        <p>{this.props.playerInfo.tickets.taxi}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.taxi <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_taxi.png")` }}/>
                    </div>
                    <div>
                        <p>{this.props.playerInfo.tickets.bus}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.bus <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_bus.png")`  }}/>
                    </div>
                    <div>
                        <p>{this.props.playerInfo.tickets.train}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.train <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_train.png")`}}/>
                    </div>
                    {this.props.playerInfo.isMisterX && <div>
                        <p>{this.props.playerInfo.tickets.black}</p>
                        <button
	                        disabled={this.props.playerInfo.tickets.black <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_black.png")`}}/>
                    </div>}
                </div>
            </div>
        );
    }
}
