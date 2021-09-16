import React from "react";

class Tree extends React.Component<any> {
	tree: any = {};

	render() {
		this.tree = this.buildTree(this.props.tree);

		const html = (Object.keys(this.tree).length === 0) ? null : this.buildHtml(this.tree);

		return (
			<ul className="list-disc">
				{html}
			</ul>
		);
	}

	buildTree(base_tree: any, move_num: number = 10) {
		const tree: any = {};

		for (let sort in base_tree![move_num]) {
			const item = base_tree![move_num][sort];
	
			tree[sort] = {
				id         : item.id,
				fen        : item.fen,
				move       : item.move,
				moveNumber : item.moveNumber,
				children   : {}
			};
	
			for (let next_sort in item.moves) {
				tree[sort].children = this.buildTree(base_tree, item.moves[next_sort].moveNumber);
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
							<ul className="list-disc">
								{this.buildHtml(move.children, false)}
							</ul>
						) :
						this.buildHtml(Object.values(move.children)[0], true)
				);

			if (single) {
				return (
					<>
						{move.move}&nbsp;
						{ul}
					</>
				);
			} else {
				html.push(
					<li key={move.id} data-id={move.id}>
						 {move.move}&nbsp;
						{ul}
					</li>
				);
			}
		}

		return html;
	}
}

export default Tree;