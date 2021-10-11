import { transcode } from "buffer";
import React from "react";

import Leaf from "./Leaf";
import LeafSpan from "./LeafSpan";

interface BranchProps {
	tree: any,
	root?: boolean,
	active?: boolean,
	active_uuid?: string | null,
	parent_uuid?: string,
	onMoveClick: Function
};

interface BranchState {
	child_active: boolean
}

class Branch extends React.PureComponent<BranchProps, BranchState> {
	ref = React.createRef<any>();

	constructor(props: BranchProps) {
		super(props);

		this.toggle = this.toggle.bind(this);

		this.state = {
			child_active: true
		};
	}

	render() {
		const classes = ["p-0 m-0 menu bg-default text-content-700"];
		const html    = (Object.keys(this.props.tree).length === 0) ? null : this.buildHtml(this.props.tree);

		if (!this.props.root) {
			classes.push("pl-2");
			classes.push("ml-1.5");
		} else {
			classes.push("ml-4.5");
		}

		if (!this.props.active) {
			classes.push("hidden");
		}

		return (
			<ul key={"branch-ul-" + this.props.parent_uuid} className={classes.join(" ")} ref={this.ref}>
				{html}
			</ul>
		);
	}

	buildHtml(segment: any, single: boolean = false): any {
		if (single || this.props.root) {
			segment = [segment];
		}

		const html = [];

		for (let sort in segment) {
			const move        = segment[sort];
			const children    = (move.transpose) ? [] : move.children;
			const child_count = Object.keys(children).length;
			let active_uuid   = this.props.active_uuid;

			if (child_count > 1) {
				if (!move.uuids.includes(active_uuid)) {
					active_uuid = "";
				}
			}

			const ul             = (child_count === 0)
				? ""
				: (
					(child_count > 1)
						? (
							<Branch key={"branch-" + move.id} parent_uuid={move.id} active={this.state.child_active} tree={children} active_uuid={active_uuid} onMoveClick={this.props.onMoveClick}/>
						) :
						this.buildHtml(Object.values(children)[0], true)
				);

			const active = (!move.transpose && this.props.active_uuid === move.id);

			if (single) {
				return (
					<>
						<LeafSpan key={"leaf-span-" + move.id} active={active} has_children={child_count > 0} children_active={this.state.child_active} onArrowClick={this.toggle} move={move} onClick={this.props.onMoveClick}/>
						{ul}
					</>
				);
			} else {
				html.push(
					<Leaf key={"leaf-" + move.id} move={move}>
						<LeafSpan key={"span-" + move.id} active={active} start={true} has_children={move.has_children} children_active={this.state.child_active} move={move} onArrowClick={this.toggle} onClick={this.props.onMoveClick}/>
						{ul}
					</Leaf>
				);
			}
		}

		return html;
	}

	toggle() {
		if (!this.ref.current) {
			return;
		}

		this.setState({
			child_active: !this.state.child_active
		});
	}
}

export default Branch;