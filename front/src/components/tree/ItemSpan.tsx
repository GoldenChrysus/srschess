import React from "react";

import { getMoveNumFromDB } from "../../helpers";

interface ItemSpanProps {
	move: any,
	start?: boolean
};

class ItemSpan extends React.Component<ItemSpanProps> {
	render() {
		const classes    = ["hover:bg-blue-100 transition cursor-pointer"];
		const black_text = "...";


		let move_num = getMoveNumFromDB(this.props.move.moveNumber, (this.props.start) ? black_text : "");

		if (move_num && move_num !== black_text) {
			move_num += ". ";
		}

		classes.push((move_num && move_num !== black_text) ? "mr-1" : "mr-2");

		return (
			<span className={classes.join(" ")}>{move_num}{this.props.move.move}</span>
		)
	}
}

export default ItemSpan;