import React from "react";
import './Board.css';
import {coordinates} from "./Coordinates";

interface BoardProps {
    onStationClicked  : (i: number) => void;
    reachableStations : Set<number>;
}

interface BoardState {

}

export default class Board extends React.Component<BoardProps, BoardState> {
    render() {
        return (
            <div className={"Board"}>
                <img className={"BoardBackground"} src="/board.png" alt=""/>
                {coordinates.map((c, idx) =>
                    Station(c[0], c[1], idx, this.props.onStationClicked, this.props.reachableStations.has(idx)))
                }
                {this.props.children}
            </div>
        );
    }
}

const Station = (left: number, top: number, idx: number, onClicked: (idx: number) => void, enabled: Boolean) => {
    return <button
        disabled={!enabled}
        className={"Station"}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : `${left * 100}%`,
            top  : `${top * 100}%`
        }}>{idx}</button>
}
