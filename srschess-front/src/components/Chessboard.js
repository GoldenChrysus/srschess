import React from "react";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Row, Col, List } from "antd";

import "react-chessground/dist/styles/chessground.css";

class Chessboard extends React.Component {
	constructor() {
		super();

		this.state = {
			chess      : new Chess(),
			tree       : {},
			tree_moves : {},
			moves      : []
		}

		this.ground_ref = React.createRef();
		this.renderListMove = this.renderListMove.bind(this);
		this.onMove = this.onMove.bind(this);
	}

	componentDidMount() {
		this.sizeBoard();
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
			<Row gutter={24} style={{ margin: "0 !important" }}>
				<Col className="gutter-row" md={{ span: 8, order : 1 }} xs={{ span : 12, order: 2 }}>
				</Col>
				<Col className="gutter-row" md={{ span: 12, order : 2 }} xs={{ span : 24, order : 1 }}>
					<Chessground
						check={this.state.chess.in_check().toString()}
						movable={config.movable}
						draggable={config.draggable}
						drawable={config.drawable}
						onMove={this.onMove}
						ref={this.ground_ref}
					/>
				</Col>
				<Col className="gutter-row" md={{ span: 4, order : 3 }} xs={{ span : 12, order : 3 }}>
					<List
						itemLayout="vertical"
						dataSource={this.state.moves}
						renderItem={this.renderListMove}
					/>
				</Col>
			</Row>
		);
	}

	renderListMove(item, index) {
		return (
			<List.Item>
				<Row>
					<Col span={4}>{index + 1}</Col>
					<Col span={10}>{item[0]}</Col>
					<Col span={10}>{(item.length === 2) ? item[1] : ""}</Col>
				</Row>
			</List.Item>
		);
	}

	sizeBoard() {
		const board  = this.ground_ref.current.el;
		const parent = board.parentElement;
		const width  = parent.clientWidth - (+parent.style.paddingLeft.replace("px", "") * 2) - 10;

		board.style.width = board.style.height = `${width}px`;
	}

	onMove(orig, dest) {
		this.state.chess.move({
			from : orig,
			to   : dest
		});

		const history     = this.state.chess.history();
		const movelist    = history.join(".");
		const move_number = (history.length + 1) / 2.0;
		const move_index  = Math.floor((history.length - 1) / 2).toFixed(0);

		let tree = {
			...this.state.tree
		};
		let tree_moves = {
			...this.state.tree_moves
		};
		let moves = this.state.moves;

		if (!tree[movelist]) {
			tree[movelist] = {
				movelist : movelist,
				move     : move_number,
				sort     : (Array.isArray(tree_moves[move_number])) ? tree_moves[move_number].length : 0,
				children : 0
			};
		}

		if (!tree_moves[move_number]) {
			tree_moves[move_number] = [];
		}

		if (!tree_moves[move_number].includes(movelist)) {
			tree_moves[move_number].push(movelist);
		}

		console.log(move_index);

		if (!moves[move_index]) {
			moves.push([]);
		}

		moves[move_index].push(history.at(-1));

		console.log(moves);

		this.setState({
			chess : this.state.chess,

			tree,
			tree_moves,
			moves
		});
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