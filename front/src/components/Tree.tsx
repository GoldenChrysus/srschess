import React from "react";

import Directory from "./tree/Directory";
import Item from "./tree/Item";
import ItemSpan from "./tree/ItemSpan";

class Tree extends React.Component<any> {
	tree: any = {};

	render() {
		this.tree = (Object.keys(this.props.tree).length > 0) ? this.buildTree() : {};

		const html = (Object.keys(this.tree).length === 0) ? null : this.buildHtml(this.tree);

		return (
			<Directory root={true}>
				{html}
			</Directory>
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

	buildHtml(segment: any, single: boolean = false): any {
		if (single) {
			segment = [segment];
		}

		const html = [];

		for (let sort in segment) {
			const move        = segment[sort];
			const child_count = Object.keys(move.children).length;
			const ul          = (child_count === 0)
				? ""
				: (
					(child_count> 1)
						? (
							<Directory>
								{this.buildHtml(move.children, false)}
							</Directory>
						) :
						this.buildHtml(Object.values(move.children)[0], true)
				);

			if (single) {
				return (
					<>
						<ItemSpan key={"span" + move.id} move={move}/>
						{ul}
					</>
				);
			} else {
				html.push(
					<Item key={"item" + move.id} move={move}>
						 <ItemSpan key={"span-" + move.id} start={true} move={move}/>
						{ul}
					</Item>
				);
			}
		}

		return html;
	}
}

export default Tree;