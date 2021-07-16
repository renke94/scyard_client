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
                    Station(c[0], c[1], c[2], idx, this.props.onStationClicked, this.props.reachableStations.has(idx)))
                }
                {this.props.children}
            </div>
        );
    }
}

const Station = (left: number, top: number, stationType: number, idx: number, onClicked: (idx: number) => void, enabled: Boolean) => {
    return <button
        disabled={!enabled}
        className={getStationTypeClass(stationType)}
        onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : `${left * 100}%`,
            top  : `${top * 100}%`
        }}>{idx}</button>
}

const getStationTypeClass = (stationType: number) => {
    const classes = ["", "StationBus", "StationTrain", "StationBusTrain"];
    return "Station " + classes[stationType];
}
