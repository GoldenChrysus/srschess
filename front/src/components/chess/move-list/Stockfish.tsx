import React from "react";
import { Switch } from "antd";

declare global {
	interface Window {
		sf : any
	}
}

interface StockfishProps {
	fen: string,
	num?: number
}

interface StockfishState {
	score: string,
	depth: number,
	enabled: boolean
}

class Stockfish extends React.Component<StockfishProps, StockfishState> {
	set_listener = false;

	constructor(props: StockfishProps) {
		super(props);

		this.receiveEval = this.receiveEval.bind(this);
		this.toggle      = this.toggle.bind(this);
		this.state       = {
			score   : "-",
			depth   : 0,
			enabled : false
		};

		this.setListener();
	}

	componentDidUpdate(prev_props: StockfishProps) {
		if (prev_props.fen !== this.props.fen) {
			this.runEval();
		}
	}

	componentWillUnmount() {
		if (window.sf && this.set_listener) {
			window.sf.removeMessageListener(this.receiveEval);
		}
	}

	render() {
		return (
			<div key="stockfish" id="stockfish" className="max-w-full">
				<div className="max-w-full 2xl:max-w-sm">
					<div key="stockfish-grid" className="grid grid-cols-12 p-2">
						<div key="stockfish-eval" className="flex justify-center items-center text-center text-2xl font-bold col-span-3">
							<span>{(this.state.enabled) ? this.state.score || "-" : "-"}</span>
						</div>
						<div key="stockfish-feedback" className="text-left text-xs text-gray-400 col-span-6">
							<p>Stockfish 14+ <span className="text-green-500 font-medium">NNUE</span></p>
							<p>{(this.state.depth && this.state.enabled) ? "Depth: " + this.state.depth + "/20" : "Waiting..."}</p>
						</div>
						<div key="stockfish-switch-container" className="flex justify-end items-center col-span-3">
							<Switch onChange={this.toggle}/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	toggle(enabled: boolean) {
		this.setState({
			enabled: enabled
		});

		if (enabled) {
			this.runEval(true);
		}
	}

	receiveEval(line: string) {
		if (line.slice(0, 8) === "bestmove") {
			const move = line.split(" ")[1];

			return;
		}

		const score_index = line.indexOf("score");

		if (!score_index) {
			return;
		}

		const depth      = +line.split(" ")[2];
		const node_index = line.indexOf("nodes", score_index);
		const score_text = line.slice(score_index + 6, (node_index !== -1) ? node_index - 1 : 100);
		const score_data = score_text.split(" ");
		const multiplier = ((this.props.num ?? 0) % 10 !== 0) ? 1 : -1;

		switch (score_data[0]) {
			case "cp":
				const score  = (+score_data[1] / 100) * multiplier;
				const prefix = (score > 0) ? "+" : "";

				this.setState({
					score : prefix + (score.toFixed(2)),
					depth : depth
				});
				break;

			case "mate":
				this.setState({
					score : "M" + (+score_data[1] * multiplier),
					depth : (+score_data[1] === 0) ? 20 : depth
				});
				break;

			default:
				break;
		}
	}

	setListener() {
		if (!window.sf || this.set_listener) {
			return;
		}

		this.set_listener = true;

		window.sf.addMessageListener(this.receiveEval);
	}

	runEval(force?: boolean) {
		this.setListener();

		if (!this.state.enabled && !force) {
			return;
		}

		if (!this.props.fen || !this.props.num) {
			return;
		}

		const sf = window.sf;
		
		if (sf) {
			sf.postMessage("position fen " + this.props.fen);
			sf.postMessage("go depth 20");
		}
	}
}

export default Stockfish;