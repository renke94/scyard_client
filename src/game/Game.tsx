import React from "react";
import Board from "../board/Board";
import MoveDialog from "../move/MoveDialog";
import GameSocket, {PlayerInfo, SelfInfo, Tickets} from "../gamesocket/GameSocket";
import Figure from "../figure/Figure";
import Move from "../move/Move";

interface GameProps {
    socket   : GameSocket;
    selfInfo : SelfInfo;
    players  : Map<string, PlayerInfo>;
}

interface GameState {
    showMoveDialog : Boolean;
    targetStation  : number;
}

export default class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            showMoveDialog: false,
            targetStation: 0,
        }
    }

    onStationClicked = (n: number) => {
        this.setState({
            showMoveDialog: true,
            targetStation: n
        });
    }

    onTicketSelected = (ticket: string) => {
        const move: Move = {
            targetStation: this.state.targetStation,
            ticket       : ticket,
        };
        this.props.socket.sendMove(move);
        this.setState({showMoveDialog: false});
    }

    reachableStations = (selfInfo: SelfInfo) => {
        const reachableStations = selfInfo.reachableStations;
        const tickets: Tickets = selfInfo.tickets;

        const stations: Set<number> = new Set<number>();

        if (tickets.TAXI  > 0) reachableStations.TAXI.forEach((v) => stations.add(v));
        if (tickets.BUS   > 0) reachableStations.BUS.forEach((v) => stations.add(v));
        if (tickets.TRAIN > 0) reachableStations.TRAIN.forEach((v) => stations.add(v));
        if (tickets.BLACK > 0) reachableStations.BLACK.forEach((v) => stations.add(v));

        return stations
    }

    render() {
        return (
            <div className={"Game"}>
                <Board
                    onStationClicked={this.onStationClicked}
                    reachableStations={this.reachableStations(this.props.selfInfo)}>

                    {Array.from(this.props.players).map((e, idx) =>
                        <Figure playerInfo={e[1]} key={idx}/>
                    )}

                    {this.props.selfInfo && <Figure playerInfo={this.props.selfInfo}/>}
                    {this.state.showMoveDialog && <MoveDialog
                        targetStation={this.state.targetStation}
                        reachableStations={this.props.selfInfo.reachableStations}
                        onTicketSelected={this.onTicketSelected}
                        onClose={() => this.setState({showMoveDialog: false})}
                        selfInfo={this.props.selfInfo}/>}
                </Board>
            </div>
        );
    }
}
