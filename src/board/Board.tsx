import React from "react";
import './Board.css';
import {coordinates} from "./Coordinates";

interface BoardProps {
    sizeInPercent    : number;
    onStationClicked : (i: number) => void;
}

interface BoardState {

}

/** Measurements for the game board
 *
 */
class BoardMeasurements {
    sizeInPercent : number; // Maybe not needed after the initial calculation
    width         : number;
    height        : number;

    boardRatio = 1280 / 950;

    constructor(sizeInPercent: number) {
        this.sizeInPercent = sizeInPercent;
        this.width = (window.innerWidth * this.sizeInPercent) / 100;
        this.height = this.width / this.boardRatio;
    }
}

export default class Board extends React.Component<BoardProps, BoardState> {
    boardMeasurements = new BoardMeasurements(this.props.sizeInPercent);

    render() {
        return (
            <div>
                <img src="/board.png" alt="" style={{
                    width  : this.boardMeasurements.width,
                    height : this.boardMeasurements.height
                }}/>
                {coordinates.map((c: number[], idx: number) =>
                    Station(c[0], c[1], idx, this.boardMeasurements, this.props.onStationClicked)
                )}
            </div>
        );
    }
}

const Station = (left: number, top: number, idx: number, boardMeasurements: BoardMeasurements, onClicked: (i: number) => void) => {
    return <button
        className={"Station"}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : boardMeasurements.width  * left,
            top  : boardMeasurements.height * top
        }}>{idx}</button>
}
