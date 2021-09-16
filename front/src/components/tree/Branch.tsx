import React from "react";

import Leaf from "./Leaf";
import LeafSpan from "./LeafSpan";

interface BranchProps {
	tree: any,
	root?: boolean,
	active?: boolean,
	onClick?: Function,
	active_uuid?: string
};

interface BranchState {
	child_active: boolean
}

class Branch extends React.Component<BranchProps, BranchState> {
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
			classes.push("ml-1");
		} else {
			classes.push("ml-4.5");
		}

		if (!this.props.active) {
			classes.push("hidden");
		}

		return (
			<ul className={classes.join(" ")} ref={this.ref}>
				{html}
			</ul>
		);
	}

	buildHtml(segment: any, single: boolean = false): any {
		if (single) {
			segment = [segment];
		}

		const html = [];

		for (let sort in segment) {
			const move           = segment[sort];
			const child_count    = Object.keys(move.children).length;
			const has_grandchild = (
				child_count > 1 ||
				(
					child_count === 1 &&
					Object.keys((Object.values(move.children)[0] as any).children).length > 1
				)
			);
			const ul             = (child_count === 0)
				? ""
				: (
					(child_count > 1)
						? (
							<Branch active={this.state.child_active} tree={move.children} active_uuid={this.props.active_uuid}/>
						) :
						this.buildHtml(Object.values(move.children)[0], true)
				);

			if (single) {
				return (
					<>
						<LeafSpan key={"leaf-span" + move.id} active={this.props.active_uuid === move.id} has_children={child_count > 0} children_active={this.state.child_active} move={move}/>
						{ul}
					</>
				);
			} else {
				html.push(
					<Leaf key={"leaf" + move.id} move={move}>
						<LeafSpan key={"span-" + move.id} active={this.props.active_uuid === move.id} start={true} has_children={has_grandchild} children_active={this.state.child_active} move={move} onClick={this.toggle}/>
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