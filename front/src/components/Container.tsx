import React from "react";
import { observer } from "mobx-react";
import { Layout } from "antd";
import Chessboard from "./Chessboard";

import { User, Repertoire, Move } from "../api/models/";
import BaseStore from "../api/models/lib/BaseStore";

interface ContainerProps {
	users: BaseStore;
}

class Container extends React.Component<ContainerProps> {
	async componentDidMount() {
		let rep = await Repertoire.byId(1);

		let move = await Move.add(
			{
				move_number : 10,
				move        : "d4",
				fen         : "test",
				sort        : 0,
			},
			{
				repertoire : {
					type : "repertoire",
					id   : rep.id
				}
			}
		);
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

export default observer(Container);