import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

import { getMoveNumFromDB } from "../../helpers";

interface LeafSpanProps {
	move: any,
	start?: boolean,
	has_children: boolean,
	children_active: boolean,
	active?: boolean,
	onClick?: any
};

class LeafSpan extends React.Component<LeafSpanProps, any> {
	render() {
		const classes      = ["transition cursor-pointer px-0.5 rounded-sm"];
		const icon_classes = ["-ml-4.5 cursor-pointer mr-1 transform transition"];
		const move_num     = getMoveNumFromDB(this.props.move.moveNumber, "... ", ". ", (this.props.start) ? undefined : "");

		classes.push((this.props.active) ? "bg-green-600" : "hover:bg-blue-800");
		classes.push((move_num.indexOf("...") !== -1 || move_num.indexOf(".") === -1) ? "mr-1.5" : "mr-0.5");

		if (this.props.children_active) {
			icon_classes.push("rotate-90");
		}

		const icon = (this.props.start && this.props.has_children)
			? <FontAwesomeIcon onClick={this.props.onClick} className={icon_classes.join(" ")} icon={faChevronCircleRight}/>
			: "";

		return (
			<>
				{icon}
				<span className={classes.join(" ")}>{move_num}{this.props.move.move}</span>
			</>
		)
	}
}

export default LeafSpan;