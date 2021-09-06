import React from "react";
import Chessground from "react-chessground";
import Chess from "chess.js";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

import "react-chessground/dist/styles/chessground.css";

class Chessboard extends React.Component {
	constructor() {
		super();

		this.state = {
			chess : new Chess(),
		}
	}

	render() {
		let shape = {
			brush : "green",
			dest : "f4",
			orig : "e2"
		};

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
				<Typography id="discrete-slider-small-steps" gutterBottom>
					Small steps
				</Typography>
				<Slider
					defaultValue={3}
					aria-labelledby="discrete-slider-small-steps"
					step={1}
					marks
					min={1}
					max={50}
					valueLabelDisplay="auto"
				/>
			</React.Fragment>
		);
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