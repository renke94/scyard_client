import React from "react";
import Board from "../board/Board";
import Figure from "../figure/Figure";
import MoveDialog from "../move/MoveDialog";
import PlayerInfo from "../player/PlayerInfo";

interface GameProps {

}

interface GameState {
    station: number;
}

export default class Game extends React.Component<GameProps, GameState> {
    state = {
        station: 0

    }

    onStationClicked = (n: number) => {
        this.setState({station: n});
    }

    render() {
        return (
            <div className={"Game"}>
                <Board onStationClicked={this.onStationClicked} sizeInPercent={60}/>
                <Figure stationNumber={this.state.station} color={"orange"} sizeInPercent={60}/>
                <Figure stationNumber={126} color={"blue"} sizeInPercent={60}/>
                <MoveDialog targetStation={0} onTicketSelect={(move) => {}} playerInfo={playerInfo}/>
            </div>
        );
    }
}

const playerInfo: PlayerInfo = {
    name     : "Jan",
    station  : 1,
    color    : "red",
    isMisterX: true,
    tickets  : {
        taxi : 4,
        bus  : 0,
        train: 2,
        black: 1
    }
}
