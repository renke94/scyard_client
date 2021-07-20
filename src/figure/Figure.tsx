import React from "react";
import {coordinates} from "../board/Coordinates";
import "./Figure.css";
import {PlayerInfo} from "../gamesocket/GameSocket";

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
    playerInfo : PlayerInfo;
}

interface FigureState {
    mouseOver: boolean;
}

export default class Figure extends React.Component<FigureProps, FigureState> {
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
                        left: `${coordinates[this.props.playerInfo.station][0] * 100}%`,
                        top : `${coordinates[this.props.playerInfo.station][1] * 100}%`,
                    }}
                >
	                <div className={"PlayerInfo"}>
		                <div className={"FigurePlayerName"}>{this.props.playerInfo.name}</div>
		                <div className={"FigurePlayerTickets"}>
                            <div>
                                <p className={"FigurePlayerTicketsAmount"}>{this.props.playerInfo.tickets.taxi}</p>
                                <img src="/ticket_taxi.png"  alt="" width={50}/>
                            </div>
                            <div>
                                <p className={"FigurePlayerTicketsAmount"}>{this.props.playerInfo.tickets.bus}</p>
                                <img src="/ticket_bus.png"   alt="" width={50}/>
                            </div>
                            <div>
                                <p className={"FigurePlayerTicketsAmount"}>{this.props.playerInfo.tickets.train}</p>
                                <img src="/ticket_train.png" alt="" width={50}/>
                            </div>
                            {this.props.playerInfo.isMisterX && <div>
	                            <p className={"FigurePlayerTicketsAmount"}>{this.props.playerInfo.tickets.black}</p>
	                            <img src="/ticket_black.png" alt="" width={50}/>
                            </div>}
		                </div>
	                </div>
                </div>}
                <img
                    className={"Figure"}
                    src={colors.get(this.props.playerInfo.color)}
                    alt=""
                    style={{
                        left: `${coordinates[this.props.playerInfo.station][0] * 100}%`,
                        top : `${coordinates[this.props.playerInfo.station][1] * 100}%`
                    }}/>
            </div>
        );
    }
}
