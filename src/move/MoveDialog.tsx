import React from "react";
import './MoveDialog.css';
import {ReachableStations, SelfInfo} from "../gamesocket/GameSocket";

interface MoveDialogProps {
    targetStation     : number;
    selfInfo          : SelfInfo;
    onTicketSelected  : (ticket: string) => void;
    onClose           : () => void;
    reachableStations : ReachableStations;
}

export default class MoveDialog extends React.Component<MoveDialogProps, any> {


    helper = (target: number, ticket: number[]) => {
        return !ticket.find((i) => i === target);
    }

    render() {
        const selfInfo = this.props.selfInfo;
        const reachableStations = this.props.reachableStations;
        const targetStation = this.props.targetStation;

        const taxiDisabled  = selfInfo.tickets.TAXI  <= 0 || !reachableStations.TAXI.find((i)  => i === targetStation);
        const busDisabled   = selfInfo.tickets.BUS   <= 0 || !reachableStations.BUS.find((i)   => i === targetStation);
        const trainDisabled = selfInfo.tickets.TRAIN <= 0 || !reachableStations.TRAIN.find((i) => i === targetStation);
        const blackDisabled = selfInfo.tickets.BLACK <= 0 || !reachableStations.BLACK.find((i) => i === targetStation);

        return (
            <div className={"MoveDialogContainer"}>
                <div className={"MoveDialog"} style={{width: selfInfo.isMisterX ? 480 : 360}}>
                    <div className={"MoveDialogHeader"}>
                        <h1>Choose Ticket</h1>
                        <button className={"MoveDialogCloseButton"} onClick={e => this.props.onClose()}>&#215;</button>
                    </div>
                    <div className={"MoveDialogTickets"}>
                        <div>
                            <p>{selfInfo.tickets.TAXI}</p>
                            <button
                                disabled={taxiDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_taxi.png")` }}
                                onClick={(e) => this.props.onTicketSelected("taxi")}
                            />
                        </div>
                        <div>
                            <p>{selfInfo.tickets.BUS}</p>
                            <button
                                disabled={busDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_bus.png")`  }}
                                onClick={(e) => this.props.onTicketSelected("bus")}
                            />
                        </div>
                        <div>
                            <p>{selfInfo.tickets.TRAIN}</p>
                            <button
                                disabled={trainDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_train.png")`}}
                                onClick={(e) => this.props.onTicketSelected("train")}
                            />
                        </div>
                        {selfInfo.isMisterX && <div>
				            <p>{selfInfo.tickets.BLACK}</p>
				            <button
					            disabled={blackDisabled}
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
