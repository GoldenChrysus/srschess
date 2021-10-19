import React from "react";
import { Input, Spin } from "antd";
import { ChessControllerState } from "../../../lib/types/ChessControllerTypes";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_REPERTOIRE_MOVE_NOTE, GET_REPERTOIRE_MOVE_NOTE } from "../../../api/queries";
import { useTranslation } from "react-i18next";

interface RepertoireMoveNoteProps {
	active_uuid?: ChessControllerState["last_uuid"]
}

function RepertoireMoveNote(props: RepertoireMoveNoteProps) {
	const { t } = useTranslation("chess");
	const { loading, error, data } = useQuery(GET_REPERTOIRE_MOVE_NOTE, {
		variables : {
			moveId : props.active_uuid
		},
		skip : (!props.active_uuid)
	});
	const [ createNote ] = useMutation(CREATE_REPERTOIRE_MOVE_NOTE);

	if (!props.active_uuid) {
		return <></>;
	}

	return (
		<Spin spinning={loading}>
			<Input.TextArea
				placeholder={t("move_note")}
				style={{ marginTop: "0.5rem" }}
				key={"note-" + props.active_uuid + "-" + (data?.repertoireMoveNote?.id || "none")}
				defaultValue={data?.repertoireMoveNote?.value || ""}
				onChange={(e) => {
					if (!props.active_uuid) {
						return;
					}

					createNote({
						variables : {
							moveId : props.active_uuid,
							value  : e.target.value
						}
					})
				}}
			/>
		</Spin>
	);
}

export default RepertoireMoveNote;