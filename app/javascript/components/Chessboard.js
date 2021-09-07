import React from "react";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Slider, Switch } from "antd";

import "react-chessground/dist/styles/chessground.css";

class Chessboard extends React.Component {
	constructor() {
		super();

		this.state = {
			chess : new Chess(),
			disabled : false
		}
	}

	render() {
		let shape = {
			brush : "green",
			dest : "f4",
			orig : "e2"
		};

		const { disabled } = this.state;
		const config = {
			movable : {
				color : this.toColor(this.state.chess),
				free  : false,
				dests : this.toDests(this.state.chess)
			},
			draggable : {
				showGhost : true
			},
			drawable : {
				eraseOnClick : false,
				onChange     : (shape) => {
					console.log(shape)
				},
				shapes : [
					shape
				]
			}
		};

		return (
			<React.Fragment>
				<Chessground
					check={this.state.chess.in_check().toString()}
					movable={config.movable}
					draggable={config.draggable}
					drawable={config.drawable}
					onMove={this.onMove.bind(this)}
				/>
				<Slider defaultValue={30} disabled={disabled} />
				<Slider range defaultValue={[20, 50]} disabled={disabled} />
				Disabled: <Switch size="small" checked={disabled} onChange={this.handleDisabledChange.bind(this)} />
			</React.Fragment>
		);
	}

	handleDisabledChange(disabled) {
		this.setState({ disabled });
	}

	onMove(orig, dest) {
		this.state.chess.move({
			from : orig,
			to   : dest
		});

		this.setState({chess : this.state.chess});
	}

	toColor() {
		return (this.state.chess.turn() === "w") ? "white" : "black";
	}

	toDests(chess) {
		const dests = new Map();

		chess.SQUARES.forEach(s => {
			const ms = chess.moves({
				square  : s,
				verbose : true
			});

			if (ms.length) {
				dests.set(s, ms.map(m => m.to));
			}
		});

		return dests;
	}
}

export default Chessboard;