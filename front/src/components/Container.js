import React from "react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

class Container extends React.Component {
	render() {	
		return (
			<Layout>
				<Layout.Header>
					Header
				</Layout.Header>
				<Layout>
					<Layout.Content>
						<Chessboard/>
					</Layout.Content>
				</Layout>
				<Layout.Footer>
					Footer
				</Layout.Footer>
			</Layout>
		);
	}
}

export default Container;