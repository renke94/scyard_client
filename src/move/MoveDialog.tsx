import React from "react";
import './MoveDialog.css';
import {PlayerInfo, ReachableStations} from "../gamesocket/GameSocket";

interface MoveDialogProps {
    targetStation     : number;
    selfInfo          : PlayerInfo;
    onTicketSelected  : (ticket: string) => void;
    onClose           : () => void;
    reachableStations : ReachableStations;
}

export default class MoveDialog extends React.Component<MoveDialogProps, any> {
    render() {
        const selfInfo = this.props.selfInfo;
        const reachableStations = this.props.reachableStations;
        const targetStation = this.props.targetStation;

        const taxiDisabled  = selfInfo.tickets.taxi  <= 0 || !reachableStations.taxi.find((i)  => i === targetStation);
        const busDisabled   = selfInfo.tickets.bus   <= 0 || !reachableStations.bus.find((i)   => i === targetStation);
        const trainDisabled = selfInfo.tickets.train <= 0 || !reachableStations.train.find((i) => i === targetStation);
        const blackDisabled = selfInfo.tickets.black <= 0 || !reachableStations.black.find((i) => i === targetStation);

        return (
            <div className={"MoveDialogContainer"}>
                <div className={"MoveDialog"} style={{width: selfInfo.isMisterX ? 480 : 360}}>
                    <div className={"MoveDialogHeader"}>
                        <h1>Choose Ticket</h1>
                        <button className={"MoveDialogCloseButton"} onClick={e => this.props.onClose()}>&#215;</button>
                    </div>
                    <div className={"MoveDialogTickets"}>
                        <div>
                            <p>{selfInfo.tickets.taxi}</p>
                            <button
                                disabled={taxiDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_taxi.png")` }}
                                onClick={(e) => this.props.onTicketSelected("taxi")}
                            />
                        </div>
                        <div>
                            <p>{selfInfo.tickets.bus}</p>
                            <button
                                disabled={busDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_bus.png")`  }}
                                onClick={(e) => this.props.onTicketSelected("bus")}
                            />
                        </div>
                        <div>
                            <p>{selfInfo.tickets.train}</p>
                            <button
                                disabled={trainDisabled}
                                className={"MoveDialogTicketButton"}
                                style={{backgroundImage: `url("ticket_train.png")`}}
                                onClick={(e) => this.props.onTicketSelected("train")}
                            />
                        </div>
                        {selfInfo.isMisterX && <div>
				            <p>{selfInfo.tickets.black}</p>
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
