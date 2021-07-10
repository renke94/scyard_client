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
                    width: 1280,    //1176,
                    height: 950     // 882
                }}/>
                {coordinates.map((c: number[], idx: number) =>
                    Station(c[0], c[1], idx, this.props.onStationClicked)
                )}
            </div>
        );
    }
}

const Station = (left: number, top: number, idx: number, onClicked: (i: number) => void) => {
    return <button
        className={"Station"}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{ left: left - 330, top: top }}>{idx}</button>
}
