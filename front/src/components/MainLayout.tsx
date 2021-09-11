import React from "react";
import { Layout } from "antd";

class MainLayout extends React.Component<any> {
	render() {
		return (
			<Layout>
				<Layout.Header>
					Header
				</Layout.Header>
				<Layout>
					<Layout.Content>
						{this.props.children}
					</Layout.Content>
				</Layout>
				<Layout.Footer>
					Footer
				</Layout.Footer>
			</Layout>
		);
	}
}

export default MainLayout;