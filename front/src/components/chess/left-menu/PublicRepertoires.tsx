import React from "react";
import Search from "../Search";

interface PublicRepertoiresProps {
	movelist           : string,
	onMoveSearchChange : Function
}

function PublicRepertoires(props: PublicRepertoiresProps) {
	return (
		<Search mode="repertoires" onMoveSearchChange={props.onMoveSearchChange} movelist={props.movelist}/>
	);
}

export default PublicRepertoires;