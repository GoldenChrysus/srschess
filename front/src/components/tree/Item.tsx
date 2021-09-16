import React from "react";

interface ItemProps {
	move: any
};

class Item extends React.Component<ItemProps> {
	render() {
		return(
			<li data-id={this.props.move.id}>
				{this.props.children}
			</li>
		)
	}
}

export default Item;