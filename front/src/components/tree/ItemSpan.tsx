import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

import { getMoveNumFromDB } from "../../helpers";

interface ItemSpanProps {
	move: any,
	start?: boolean,
	has_children: boolean,
	active?: boolean
};

class ItemSpan extends React.Component<ItemSpanProps, any> {
	render() {
		const classes      = ["transition cursor-pointer px-0.5"];
		const icon_classes = ["-ml-4.5 cursor-pointer mr-1 transform transition"];
		const move_num     = getMoveNumFromDB(this.props.move.moveNumber, "... ", ". ", (this.props.start) ? undefined : "");

		classes.push((this.props.active) ? "bg-green-600" : "hover:bg-blue-800");
		classes.push((move_num.indexOf("...") !== -1 || move_num.indexOf(".") === -1) ? "mr-1.5" : "mr-0.5");

		const icon = (this.props.start && this.props.has_children)
			? <FontAwesomeIcon className={icon_classes.join(" ")} icon={faChevronCircleRight}/>
			: "";

		return (
			<>
				{icon}
				<span className={classes.join(" ")}>{move_num}{this.props.move.move}</span>
			</>
		)
	}
}

export default ItemSpan;