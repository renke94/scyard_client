import React from "react";
import Board from "../board/Board";
import Figure from "../figure/Figure";

interface GameProps {

}

interface GameState {

}

export default class Game extends React.Component<GameProps, GameState> {
    render() {
        return (
            <div className={"Game"}>
                <Board onStationClicked={(n) => console.log(n)} sizeInPercent={60}/>
                <Figure stationNumber={80} color={"orange"}/>
                <Figure stationNumber={126} color={"blue"}/>
            </div>
        );
    }
}
