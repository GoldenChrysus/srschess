import React from "react";
import Chessground from "react-chessground";
import Chess from "chess.js";
import { Row, Col, List, Layout } from "antd";

import "react-chessground/dist/styles/chessground.css";

class Chessboard extends React.Component {
	constructor() {
		super();

		this.state = {
			chess    : new Chess(),
			moves : [
				[
					"d4",
					"d5"
				],
				[
					"Bf4"
				],
			]
		}

		this.ground_ref = React.createRef();
		this.renderListMove = this.renderListMove.bind(this);
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
						onMove={this.onMove.bind(this)}
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