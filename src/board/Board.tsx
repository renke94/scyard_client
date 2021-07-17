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
                {coordinates.map((_, idx) =>
                    Station(idx, this.props.onStationClicked, this.props.reachableStations.has(idx)))
                }
                {this.props.children}
            </div>
        );
    }
}

const Station = (idx: number, onClicked: (idx: number) => void, enabled: Boolean) => {
    const c: number[] = coordinates[idx];
    const left = c[0];
    const top  = c[1];
    const type = c[2];

    return <button
        disabled={!enabled}
        className={"Station"}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : `${left * 100}%`,
            top  : `${top * 100}%`,
            backgroundImage: `url("${classes[type]}")`,
        }}>{idx}</button>
}


const classes = ["/StationTaxi.png", "/StationBus.png", "/StationTrainBus.png", "/StationTrainBus.png"];
