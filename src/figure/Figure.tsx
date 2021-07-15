import React from "react";
import {coordinates} from "../board/Coordinates";
import "./Figure.css";
import {BoardMeasurements} from "../board/Board";

const colors = new Map<string, string>([
    ["black" , "/figure_black.png"],
    ["blue"  , "/figure_blue.png"],
    ["green" , "/figure_green.png"],
    ["metal" , "/figure_metal.png"],
    ["orange", "/figure_orange.png"],
    ["pink"  , "/figure_pink.png"],
    ["red"   , "/figure_red.png"],
    ["white" , "/figure_white.png"],
]);

interface FigureProps {
    stationNumber : number;
    color         : string;
    sizeInPercent : number;
}

interface FigureState {
    mouseOver: boolean;
}

export default class Figure extends React.Component<FigureProps, FigureState> {
    boardMeasurements = new BoardMeasurements(this.props.sizeInPercent);

    state = {
        mouseOver: false
    }

    render() {
        return (
            <div
                onMouseEnter={event => this.setState({mouseOver: true})}
                onMouseLeave={event => this.setState({mouseOver: false})}
            >
                {this.state.mouseOver && <div
                    className={"PlayerInfoPadding"}
                    style={{
                        left: this.boardMeasurements.width  * coordinates[this.props.stationNumber][0],
                        top : this.boardMeasurements.height * coordinates[this.props.stationNumber][1],
                    }}
                >
	                <div className={"PlayerInfo"}>
		                <div className={"FigurePlayerName"}>Jan</div>
		                <div className={"FigurePlayerTickets"}>
                            <div><p className={"FigurePlayerTicketsAmount"}>0</p><img src="/ticket_taxi.png" alt=""  width={50}/></div>
                            <div><p className={"FigurePlayerTicketsAmount"}>0</p><img src="/ticket_bus.png" alt=""   width={50}/></div>
                            <div><p className={"FigurePlayerTicketsAmount"}>0</p><img src="/ticket_train.png" alt="" width={50}/></div>
		                </div>
	                </div>
                </div>}
                <img
                    className={"Figure"}
                    src={colors.get(this.props.color)}
                    alt=""
                    style={{
                        left: this.boardMeasurements.width  * coordinates[this.props.stationNumber][0],
                        top : this.boardMeasurements.height * coordinates[this.props.stationNumber][1]
                    }}/>
            </div>
        );
    }
}
