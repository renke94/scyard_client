import React from "react";
import './MoveDialog.css';
import {PlayerInfo} from "../gamesocket/GameSocket";

interface MoveDialogProps {
    targetStation    : number;
    playerInfo       : PlayerInfo;
    onTicketSelected : (ticket: string) => void;
    onClose          : () => void;
}

export default class MoveDialog extends React.Component<MoveDialogProps, any> {
    render() {
        return (
            <div className={"MoveDialogContainer"}>
                <div className={"MoveDialog"} style={{width: this.props.playerInfo.tickets.BLACK > 0 ? 480 : 360}}>
                    <div className={"MoveDialogHeader"}>
                        <h1>Choose Ticket</h1>
                        <button className={"MoveDialogCloseButton"} onClick={e => this.props.onClose()}>&#215;</button>
                    </div>
                    <div className={"MoveDialogTickets"}>
                        <div>
                            <p>{this.props.playerInfo.tickets.TAXI}</p>
                            <button
                                disabled={this.props.playerInfo.tickets.TAXI <= 0}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_taxi.png")` }}
                                onClick={(e) => this.props.onTicketSelected("taxi")}
                            />
                        </div>
                        <div>
                            <p>{this.props.playerInfo.tickets.BUS}</p>
                            <button
                                disabled={this.props.playerInfo.tickets.BUS <= 0}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_bus.png")`  }}
                                onClick={(e) => this.props.onTicketSelected("bus")}
                            />
                        </div>
                        <div>
                            <p>{this.props.playerInfo.tickets.TRAIN}</p>
                            <button
                                disabled={this.props.playerInfo.tickets.TRAIN <= 0}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_train.png")`}}
                                onClick={(e) => this.props.onTicketSelected("train")}
                            />
                        </div>
                        {this.props.playerInfo.tickets.BLACK > 0 && <div>
				            <p>{this.props.playerInfo.tickets.BLACK}</p>
				            <button
					            disabled={this.props.playerInfo.tickets.BLACK <= 0}
					            className={"MoveDialogTicketButton"}
					            style={{backgroundImage: `url("ticket_black.png")`}}
					            onClick={(e) => this.props.onTicketSelected("black")}
				            />
			            </div>}
                    </div>
                </div>
            </div>
        );
    }
}
