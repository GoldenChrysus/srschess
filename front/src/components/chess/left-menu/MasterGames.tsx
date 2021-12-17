import React from "react";
import Search from "../Search";

interface MasterGamesProps {
	movelist            : string,
	onMoveSearchChange? : Function
}

function MasterGames(props: MasterGamesProps) {
	return (
		<Search mode="master_games" onMoveSearchChange={props.onMoveSearchChange} movelist={props.movelist}/>
	);
}

export default MasterGames;