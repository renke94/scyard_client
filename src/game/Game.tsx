import React from "react";
import Board from "../board/Board";
import GameSocket, {GameInfo, MisterXUpdatedEvent, PlayerInfo} from "../gamesocket/GameSocket";
import Figure from "../figure/Figure";

interface GameProps {
    socket: GameSocket;
    gameInfo: GameInfo;
    misterXInfo: PlayerInfo | undefined;
}

interface GameState {
    gameInfo: GameInfo;
    misterXInfo: PlayerInfo | undefined;
}

export default class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            gameInfo: this.props.gameInfo,
            misterXInfo: this.props.misterXInfo,
        }
    }

    componentDidMount() {
        this.props.socket.onMisterXUpdated((e: MisterXUpdatedEvent) => {
            this.setState({misterXInfo: e.playerInfo});
        });
    }

    onStationClicked = (n: number) => {

    }

    render() {
        return (
            <div className={"Game"}>
                <Board onStationClicked={this.onStationClicked} sizeInPercent={60}/>
                {this.state.gameInfo.detectives.map((p) => <Figure playerInfo={p} sizeInPercent={60}/>)}
                {this.state.misterXInfo && <Figure playerInfo={this.state.misterXInfo} sizeInPercent={60}/>}
                {/*<MoveDialog
                    targetStation={0}
                    onTicketSelect={(move) => this.props.socket.sendMove(move)}
                    playerInfo={playerInfo}/>*/}
            </div>
        );
    }
}
