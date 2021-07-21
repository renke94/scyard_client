import React from "react";
import Board from "../board/Board";
import MoveDialog from "../move/MoveDialog";
import GameSocket, {
    Message, MisterXWasCaughtEvent,
    MisterXWasSeenEvent,
    PlayerInfo,
    Tickets,
    UpdatePlayerInfoEvent,
    UpdateSelfInfoEvent
} from "../gamesocket/GameSocket";
import Figure, {MisterX} from "../figure/Figure";
import Move from "../move/Move";

interface GameProps {
    socket    : GameSocket;
    onMessage : (msg: Message) => void;
}

interface GameState {
    selfInfo       : PlayerInfo | undefined;
    players        : Map<string, PlayerInfo>;
    showMoveDialog : Boolean;
    targetStation  : number;
    misterXInfo    : PlayerInfo | undefined;
}

export default class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            selfInfo       : undefined,
            players        : new Map<string, PlayerInfo>(),
            showMoveDialog : false,
            targetStation  : 0,
            misterXInfo    : undefined,
        }

        this.socketEvents(this.props.socket)
    }

    componentDidMount() {
        this.props.socket.clientReady();
    }

    socketEvents = (socket: GameSocket) => {
        socket.onPlayerUpdated((e: UpdatePlayerInfoEvent) => {
            const players = this.state.players;
            e.data.forEach((info: PlayerInfo) => {
                players.set(info.uuid, info)
            })
            this.setState({players: players});
        });

        socket.onSelfUpdated((e: UpdateSelfInfoEvent) => {
            this.setState({selfInfo: e.data});
        });

        socket.onMisterXWasSeen((e: MisterXWasSeenEvent) => {
            this.props.onMessage({
                text   : e.message,
                sender : "Server",
                date   : new Date(),
            });
            this.setState({misterXInfo: e.data});
        });

        socket.onMisterXWasCaught((e: MisterXWasCaughtEvent) => {
            this.props.onMessage({
                text   : e.message,
                sender : "Server",
                date   : new Date(),
            });
        });
    }

    onStationClicked = (n: number) => {
        this.setState({
            showMoveDialog: !!this.state.selfInfo,
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

    reachableStations = (selfInfo: PlayerInfo | undefined) => {
        if (!selfInfo) return new Set<number>();
        const reachableStations = selfInfo.reachableStations;
        const tickets: Tickets = selfInfo.tickets;

        const stations: Set<number> = new Set<number>();

        if (tickets.taxi  > 0) reachableStations.taxi.forEach((v)  => stations.add(v));
        if (tickets.bus   > 0) reachableStations.bus.forEach((v)   => stations.add(v));
        if (tickets.train > 0) reachableStations.train.forEach((v) => stations.add(v));
        if (tickets.black > 0) reachableStations.black.forEach((v) => stations.add(v));

        return stations
    }

    render() {
        return (
            <div className={"Game"}>
                <Board
                    onStationClicked={this.onStationClicked}
                    reachableStations={this.reachableStations(this.state.selfInfo)}>

                    {Array.from(this.state.players).map((e, idx) =>
                        <Figure playerInfo={e[1]} key={idx}/>
                    )}

                    {this.state.misterXInfo && <MisterX playerInfo={this.state.misterXInfo}/>}

                    {/*{this.state.selfInfo && <Figure playerInfo={this.state.selfInfo}/>}*/}
                    {this.state.showMoveDialog && this.state.selfInfo && <MoveDialog
                        targetStation={this.state.targetStation}
                        reachableStations={this.state.selfInfo.reachableStations}
                        onTicketSelected={this.onTicketSelected}
                        onClose={() => this.setState({showMoveDialog: false})}
                        selfInfo={this.state.selfInfo}/>}
                </Board>
            </div>
        );
    }
}
