import React from "react";
import './Board.css';
import {coordinates} from "./Coordinates";

interface BoardProps {
    onStationClicked : (i: number) => void;
}

interface BoardState {
    coordinates: number[][];
}

/** Measurements for the game board
 *
 */
export class BoardMeasurements {
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
    constructor(props: BoardProps) {
        super(props);

        this.state = {
            coordinates: coordinates
        }
    }

    onStationKeyDown = (idx: number, offset: number[]) => {
        const coordinates = this.state.coordinates.slice();
        coordinates[idx] = [coordinates[idx][0] + offset[0], coordinates[idx][1] + offset[1]];
        this.setState({coordinates: coordinates});
    }

    render() {
        return (
            <div className={"Board"}>
                <img className={"BoardBackground"} src="/board.png" alt=""/>
                {this.state.coordinates.map((c, idx) => Station(c[0], c[1], idx, this.onStationKeyDown))}
                <button style={{
                    position: 'absolute'
                }
                } onClick={() => {
                    let s = ""
                    this.state.coordinates.forEach((c) => {
                        s += `[${c[0]}, ${c[1]}], \n`;
                    })
                    console.log(s);
                }
                }>print</button>
            </div>
        );
    }
}

const Station = (left: number, top: number, idx: number, onKeyDown: (idx: number, offset: number[]) => void) => {
    return <button
        onKeyDown={(e) => {
            if (e.key === "ArrowUp") onKeyDown(idx, [0, -0.001])
            else if (e.key === "ArrowDown") onKeyDown(idx, [0, 0.001])
            else if (e.key === "ArrowLeft") onKeyDown(idx, [-0.001, 0])
            else if (e.key === "ArrowRight") onKeyDown(idx, [0.001, 0])
        }}
        className={"Station"}
        // onClick={() => onClicked(idx)}
        key={idx}
        style={{
            left : `${left * 100}%`,
            top  : `${top * 100}%`
        }}>{idx}</button>
}
