import { TFunction } from "react-i18next";

import { RepertoireQueryData } from "../lib/types/models/Repertoire";
import { CollectionQueryData } from "../lib/types/models/Collection";
import { GameModel } from "../lib/types/models/Game";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";

import { ROUTES } from ".";

export function createGameDatabaseRouteMeta(t: TFunction<("database" | "chess")[]>, collection?: CollectionQueryData["collection"], collection_game?: GameModel | null, master_game?: GameModel | null) {
	const meta = getMetaObject();
	const game = collection_game ?? master_game;

	let title_parts = [];

	if (game) {
		title_parts.push(t("chess:game_one") + ": " + game!.white + " - " + game!.black);
	}

	if (collection) {
		title_parts.push(t("collection") + ": " + collection.name);
	}

	title_parts.push(t("game_database"));

	meta.title    = title_parts.join(" - ");
	meta.og_title = createOGMetaTitle(meta.title);

	if (collection_game) {
		meta.url = ROUTES.collection_game
			.replace(/:collection_slug\??/, collection?.slug ?? "")
			.replace(/:game_id\??/, collection_game.id);
	} else if (master_game) {
		meta.url = ROUTES.master_game.replace(/:master_game_id\??/, master_game.id);
	} else if (collection) {
		meta.url = ROUTES.collection.replace(/:collection_slug\??/, collection.slug ?? "");
	} else {
		meta.url = ROUTES.game_database;
	}

	return meta;
}

export function createRepertoireRouteMeta(t: TFunction<"repertoires">, mode: ChessControllerProps["mode"], repertoire?: RepertoireQueryData["repertoire"]) {
	const meta = getMetaObject();

	meta.title = t(mode + "s");

	if (repertoire) {
		meta.title += ": " + repertoire.name;
	}

	meta.og_title = createOGMetaTitle(meta.title);

	if (mode === "review") {
		meta.url = ROUTES.reviews;
	} else if (mode === "lesson") {
		meta.url = ROUTES.lessons;
	} else {
		meta.url = ROUTES.repertoires;
	}

	meta.url = meta.url.replace(/:slug\??/, repertoire?.slug ?? "");

	return meta;
}

export function createOpeningExplorerRouteMeta(t: TFunction<"openings">) {
	const meta = getMetaObject();

	meta.title = t("openings_explorer");
	meta.url   = ROUTES.openings_explorer;

	return meta;
}

function createOGMetaTitle(title: string) {
	return title + " - Chess HQ";
}

function getMetaObject() {
	return {
		title       : "",
		description : "",
		og_title    : "",
		url         : ""
	};
}