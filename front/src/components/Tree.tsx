import { ApolloClient, useQuery } from "@apollo/client";
import React, { useEffect, useRef } from "react";

import { GET_MOVE, GET_REPERTOIRE_MOVES } from "../api/queries";
import { ChessControllerState } from "../lib/types/ChessControllerTypes";
import Branch from "./tree/Branch";

import "../styles/components/tree.css";
import { Spin } from "antd";

interface TreeProps {
	client           : ApolloClient<object>,
	repertoire_slug? : string,
	active_uuid      : ChessControllerState["last_uuid"],
	new_move?        : boolean,
	onMoveClick      : Function,
	moves            : ChessControllerState["moves"]
}

interface BaseTree {
	[move_num: number] : {
		[sort: number] : {
			[key: string | number] : any
		}
	}
}

var base_tree: BaseTree = {};
var tree: any = {};

function Tree(props: TreeProps) {
	const prev_move_count_ref = useRef<number>();
	const prev_slug_ref       = useRef<TreeProps["repertoire_slug"]>();

	const { loading, error, data } = useQuery(
		GET_REPERTOIRE_MOVES,
		{
			variables : {
				slug : props.repertoire_slug
			},
			fetchPolicy : "cache-only"
		}
	);

	useEffect(() => {
		if (prev_slug_ref.current !== props.repertoire_slug || (data?.repertoire?.moves.length ?? 0) !== prev_move_count_ref.current) {
			base_tree = buildBaseTree(props, data?.repertoire?.moves ?? []);
		}

		prev_move_count_ref.current = data?.repertoire?.moves.length ?? 0;
		prev_slug_ref.current       = props.repertoire_slug;
	});

	tree = (Object.keys(base_tree).length > 0) ? buildTree() : {};

	const branches = [];
	
	for (let sort in tree) {
		const move_idx = Math.round(tree[sort].moveNumber / 5) - 2;

		let active_uuid = props.active_uuid;

		if (props.moves[move_idx] !== tree[sort].move) {
			active_uuid = "";
		}

		branches.push(
			<Branch
				key={"root-branch-" + sort}
				root={true}
				active={true}
				tree={tree[sort]}
				moves={(active_uuid) ? props.moves : false}
				active_uuid={active_uuid}
				onMoveClick={props.onMoveClick}
			/>
		);
	}

	return (
		<Spin spinning={loading}>
			{branches}
		</Spin>
	);
}

function buildBaseTree(props: TreeProps, moves: any) {
	const tree: BaseTree = {};

	for (const move of moves ?? []) {
		const tmp_move = {...move};

		if (!tree[tmp_move.moveNumber]) {
			tree[tmp_move.moveNumber] = {};
		}

		tmp_move.moves = [];

		if (tmp_move.transpositionId) {
			const transposition = getMove(props, tmp_move.transpositionId);

			if (transposition) {
				tmp_move.moves.push({
					sort       : transposition.sort,
					moveNumber : transposition.moveNumber,
					transpose  : true
				});
			}
		}

		tree[tmp_move.moveNumber][tmp_move.sort] = tmp_move;

		if (tmp_move.parentId) {
			let parent = getMove(props, tmp_move.parentId);

			tree[parent.moveNumber][parent.sort].moves.push({
				sort       : tmp_move.sort,
				moveNumber : tmp_move.moveNumber
			});

			let has_children       = false;
			let local_has_children = (tree[parent.moveNumber][parent.sort].moves.length > 1)

			while (parent.parentId) {
				parent = getMove(props, parent.parentId);

				const parent_parent = (parent.parentId) ? getMove(props, parent.parentId) : false;

				if ((local_has_children || tree[parent.moveNumber][parent.sort].moves.length > 1) && (!parent_parent || tree[parent_parent.moveNumber][parent_parent.sort].moves.length === 1)) {
					has_children = true;							
				}
				
				tree[parent.moveNumber][parent.sort].has_children = has_children;
			}
		}
	}

	return tree;
}

function buildTree(move_num: number = 10, focus_sort?: number, transpose?: boolean) {
	const tree: any     = {};
	const allowed_sorts = (focus_sort !== undefined) ? [focus_sort] : Object.keys(base_tree[move_num]);

	for (const sort of allowed_sorts) {
		const item = base_tree![move_num][sort as number];

		tree[sort] = {
			id           : item.id,
			fen          : item.fen,
			move         : item.move,
			moveNumber   : item.moveNumber,
			has_children : (item.has_children || item.moves.length > 1),
			children     : {},
			transpose    : transpose || false
		};

		for (let index in item.moves) {
			tree[sort].children = Object.assign(tree[sort].children, buildTree(item.moves[index].moveNumber, item.moves[index].sort, item.moves[index].transpose));
		}
	}

	return tree;
}

function getMove(props: TreeProps, id: string) {
	return props.client.readFragment({
		id       : "Move:" + id,
		fragment : GET_MOVE
	});
}

export default Tree;