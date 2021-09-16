import React from "react";

interface DirectoryProps {
	root?: boolean
};

class Directory extends React.Component<DirectoryProps> {
	render() {
		const classes = ["p-0 m-0 menu bg-default text-content-700"];

		if (!this.props.root) {
			classes.push("pl-2");
			classes.push("ml-1");
		} else {
			classes.push("ml-4.5");
		}

		return (
			<ul className={classes.join(" ")}>
				{this.props.children}
			</ul>
		);
	}
}

export default Directory;