import React from "react";
import './Board.css';
import {coordinates} from "./Coordinates";

interface BoardProps {
    onStationClicked: (i: number) => void;
}

interface BoardState {

}

export default class Board extends React.Component<BoardProps, BoardState> {
    render() {
        return (
            <div>
                <img src="/board.png" alt="" style={{
                    width  : boardMeasurements.width,
                    height : boardMeasurements.height
                }}/>
                {coordinates.map((c: number[], idx: number) =>
                    Station(c[0], c[1], idx, this.props.onStationClicked)
                )}
            </div>
        );
    }
}

/** Measurements for the game board
 *
 * If someone wants to adjust the size of the game board, the ration should be the same.
 * The easiest way to do this without the need to calculate new values and lose the old
 * ones is to use a scale factor, e.g. 1280 * 1.5.
 */
const boardMeasurements = {
    width  : 1280,
    height : 950
}

const Station = (left: number, top: number, idx: number, onClicked: (i: number) => void) => {
    return <button
        className={"Station"}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : boardMeasurements.width  * left,
            top  : boardMeasurements.height * top
        }}>{idx}</button>
}
