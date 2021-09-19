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
	onArrowClick?: any,
	onClick: any,
};

class LeafSpan extends React.Component<LeafSpanProps, any> {
	shouldComponentUpdate(next_props: LeafSpanProps) {
		return (
			this.props.move.id !== next_props.move.id ||
			this.props.has_children !== next_props.has_children ||
			this.props.children_active !== next_props.children_active ||
			this.props.active !== next_props.active
		);
	}

	render() {
		const classes      = ["select-none transition cursor-pointer px-0.5 rounded-sm"];
		const icon_classes = ["-ml-4.5 cursor-pointer mr-3 transform transition"];
		const move_num     = getMoveNumFromDB(this.props.move.moveNumber, "... ", ". ", (this.props.start) ? undefined : "");

		classes.push((this.props.active) ? "bg-green-600" : "hover:bg-blue-800");
		classes.push((move_num.indexOf("...") !== -1 || move_num.indexOf(".") === -1) ? "mr-1.5" : "mr-0.5");

		if (this.props.children_active) {
			icon_classes.push("rotate-90");
		}

		const icon = (this.props.start && this.props.has_children)
			? <FontAwesomeIcon key={"leafspan-icon-" + this.props.move.id} onClick={this.props.onArrowClick} className={icon_classes.join(" ")} icon={faChevronCircleRight}/>
			: "";

		return (
			<>
				{icon}
				<span key={"leafspan-span-" + this.props.move.id} onClick={() => this.props.onClick(this.props.move.id)} className={classes.join(" ")}>{move_num}{this.props.move.move}</span>
			</>
		)
	}
}

export default LeafSpan;