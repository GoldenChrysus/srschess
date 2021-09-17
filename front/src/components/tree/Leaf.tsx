import React from "react";

interface LeafProps {
	move: any
};

class Leaf extends React.Component<LeafProps> {
	render() {
		return(
			<li key={"leaf-li" + this.props.move.id} className="mt-1" data-id={this.props.move.id}>
				{this.props.children}
			</li>
		)
	}
}

export default Leaf;