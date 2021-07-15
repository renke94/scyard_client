import React from "react";
import Move from "./Move";
import './MoveDialog.css';
import {PlayerInfo} from "../gamesocket/GameSocket";

interface MoveDialogProps {
    targetStation : number;
    playerInfo    : PlayerInfo;
    onTicketSelect: (move: Move) => void;
}

export default class MoveDialog extends React.Component<MoveDialogProps, any> {
    onTicketSelected = (ticket: string) => {
        const move: Move = {
            targetStation: this.props.targetStation,
            ticket       : ticket,
        };
        this.props.onTicketSelect(move);
    }

    render() {
        return (
            <div className={"MoveDialog"} style={{width: this.props.playerInfo.tickets.black > 0 ? 480 : 360}}>
                <div className={"MoveDialogHeader"}>
                    <h1>Choose Ticket</h1>
                    <button className={"MoveDialogCloseButton"}>&#215;</button>
                </div>
                <div className={"MoveDialogTickets"}>
                    <div>
                        <p>{this.props.playerInfo.tickets.taxi}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.taxi <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_taxi.png")` }}
                            onClick={(e) => this.onTicketSelected("taxi")}
                        />
                    </div>
                    <div>
                        <p>{this.props.playerInfo.tickets.bus}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.bus <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_bus.png")`  }}
                            onClick={(e) => this.onTicketSelected("bus")}
                        />
                    </div>
                    <div>
                        <p>{this.props.playerInfo.tickets.train}</p>
                        <button
                            disabled={this.props.playerInfo.tickets.train <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_train.png")`}}
                            onClick={(e) => this.onTicketSelected("train")}
                        />
                    </div>
                    {this.props.playerInfo.tickets.black > 0 && <div>
                        <p>{this.props.playerInfo.tickets.black}</p>
                        <button
	                        disabled={this.props.playerInfo.tickets.black <= 0}
                            className={"MoveDialogTicketButton"}
                            style={{backgroundImage: `url("ticket_black.png")`}}
	                        onClick={(e) => this.onTicketSelected("black")}
                        />
                    </div>}
                </div>
            </div>
        );
    }
}
