import React from "react";

import { GET_MOVE } from "../api/queries";
import { ChessControllerProps, ChessControllerState } from "../lib/types/ChessControllerTypes";
import Branch from "./tree/Branch";

interface TreeProps {
	client       : any,
	repertoire   : ChessControllerProps["repertoire"],
	active_uuid? : string,
	new_move?    : boolean,
	onMoveClick  : any,
	moves        : ChessControllerState["moves"]
}

interface TreeState {
	base_tree : {
		[move_num: number] : {
			[sort: number] : {
				[key: string | number] : any
			}
		}
	}
}

class Tree extends React.Component<any, TreeState> {
	tree : any = {};

	constructor(props: any) {
		super(props);

		this.state = {
			base_tree : {}
		};
	}
	
	componentDidUpdate(prev_props: any) {
		if (this.props.repertoire && this.props.repertoire.moves.length !== prev_props.repertoire?.moves.length) {
			const tree: TreeState["base_tree"] = {};

			for (const move of this.props.repertoire.moves) {
				const tmp_move = {...move};
	
				if (!tree[tmp_move.moveNumber]) {
					tree[tmp_move.moveNumber] = {};
				}
	
				tmp_move.moves = [];
	
				tree[tmp_move.moveNumber][tmp_move.sort] = tmp_move;
	
				if (tmp_move.parentId) {
					let parent = this.getMove(tmp_move.parentId);
	
					tree[parent.moveNumber][parent.sort].moves.push({
						sort       : tmp_move.sort,
						moveNumber : tmp_move.moveNumber
					});

					let has_children = false;

					while (parent.parentId) {
						parent = this.getMove(parent.parentId);

						const parent_parent = (parent.parentId) ? this.getMove(parent.parentId) : false;

						if (tree[parent.moveNumber][parent.sort].moves.length > 1 && (!parent_parent || tree[parent_parent.moveNumber][parent_parent.sort].moves.length === 1)) {
							has_children = true;							
						}
						
						tree[parent.moveNumber][parent.sort].has_children = has_children;
					}
				}
			}

			console.log(tree);

			this.tree = {};

			this.setState({ base_tree : tree });
		}
	}

	render() {
		if (this.props.new_move || Object.keys(this.tree).length === 0) {
			this.tree = (Object.keys(this.state.base_tree).length > 0) ? this.buildTree() : {};
		}

		const branches = [];
		
		for (let sort in this.tree) {
			const move_idx = Math.round(this.tree[sort].moveNumber / 5) - 2;

			let active_uuid = this.props.active_uuid;

			if (this.props.moves[move_idx] !== this.tree[sort].move) {
				active_uuid = "";
			}

			branches.push(
				<Branch
					key={"root-branch-" + sort}
					root={true}
					active={true}
					tree={this.tree[sort]}
					moves={(active_uuid) ? this.props.moves : false}
					active_uuid={active_uuid}
					onMoveClick={this.props.onMoveClick}
				/>
			);
		}

		return branches;
	}

	buildTree(move_num: number = 10, focus_sort?: number) {
		const tree: any     = {};
		const allowed_sorts = (focus_sort !== undefined) ? [focus_sort] : Object.keys(this.state.base_tree[move_num]);

		for (const sort of allowed_sorts) {
			const item = this.state.base_tree![move_num][sort as number];

			tree[sort] = {
				id           : item.id,
				fen          : item.fen,
				move         : item.move,
				moveNumber   : item.moveNumber,
				has_children : (item.has_children || item.moves.length > 1),
				children     : {}
			};

			for (let index in item.moves) {
				tree[sort].children = Object.assign(tree[sort].children, this.buildTree(item.moves[index].moveNumber, item.moves[index].sort));
			}
		}
	
		return tree;
	}

	getMove(id: string) {
		return this.props.client.readFragment({
			id       : "Move:" + id,
			fragment : GET_MOVE
		});
	}
}

export default Tree;