import React from "react";
import Board from "../board/Board";
import Figure from "../figure/Figure";

interface GameProps {

}

interface GameState {
    station: number;
}

export default class Game extends React.Component<GameProps, GameState> {
    state = {
        station: 0
    }

    render() {
        return (
            <div className={"Game"}>
                <Board onStationClicked={(n) => this.setState({station: n})}/>
                <Figure stationNumber={this.state.station} color={"orange"}/>
                <Figure stationNumber={126} color={"blue"}/>
            </div>
        );
    }
}
