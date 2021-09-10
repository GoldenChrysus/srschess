import React from "react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

import { memory } from "../api/sources/memory";

class Container extends React.Component {
	componentDidMount() {
		/* memory.update(t =>
			t.addRecord({
				type : "user",
				id: "",
				attributes : {
					email: "email3@email.com",
					password: "1234"
				}
			})
		).then(() => {
			memory.query(q =>
				q.findRecord({
					type : "user",
					id: "5"
				})
			).then((d) => {
				console.log(d);
			}); 
		}); */

		memory.query(q =>
			q.findRecord({
				type : "repertoire",
				id: "1"
			})
		).then((d) => {
			console.log(d);
		});
	}

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