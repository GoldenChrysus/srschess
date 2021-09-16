import React from "react";

import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import Branch from "./tree/Branch";

interface TreeProps {
	tree: ChessControllerProps["tree"],
	active_uuid?: string,
	new_move?: boolean
}

class Tree extends React.Component<any> {
	tree: any = {};

	render() {
		if (this.props.new_move || Object.keys(this.tree).length === 0) {
			this.tree = (Object.keys(this.props.tree).length > 0) ? this.buildTree() : {};
		}

		return (
			<Branch root={true} active={true} tree={this.tree} active_uuid={this.props.active_uuid}/>
		);
	}

	buildTree(move_num: number = 10, focus_sort?: number) {
		const tree: any     = {};
		const allowed_sorts = (focus_sort !== undefined) ? [focus_sort] : Object.keys(this.props.tree[move_num]);

		for (const sort of allowed_sorts) {
			const item = this.props.tree![move_num][sort];

			tree[sort] = {
				id         : item.id,
				fen        : item.fen,
				move       : item.move,
				moveNumber : item.moveNumber,
				children   : {}
			};

			for (let index in item.moves) {
				tree[sort].children = Object.assign(tree[sort].children, this.buildTree(item.moves[index].moveNumber, item.moves[index].sort));
			}
		}
	
		return tree;
	}
}

export default Tree;