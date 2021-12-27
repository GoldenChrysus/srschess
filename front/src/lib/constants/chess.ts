import { ChessSearchQueryData, ChessSearchResultItemModel } from "../types/models/ChessSearch";
import { GameModel } from "../types/models/Game";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const DEMO_MASTER_GAME_RESULTS: ChessSearchQueryData = {
	chessSearch : [
		{
			slug      : "-1",
			name      : "Fischer, R - Spassky, Boris V",
			createdAt : "1972-07-23",
			result    : 1,
			event     : "World Chess Championship 1972",
			round     : "6"
		}
	]
};

export const DEMO_MASTER_GAMES: Array<GameModel> = [
	{
		id     : "87237975-48c1-2821-6b28-eb528904cd6d",
		slug   : "-1",
		result : "1-0",
		name   : "Fischer, R - Spassky, Boris V",
		source : "",
		date   : "1972-07-23",
		event  : "World Chess Championship 1972",
		round  : "6",
		white  : "Fischer, R",
		black  : "Spassky, Boris V",
		pgn    : `[Event "FIDE (28) 1970-1972"]
[Site "Reykjavik wch-m"]
[Date "1972.07.23"]
[Round "1"]
[White "Fischer, R."]
[Black "Spassky, Boris V"]
[Result "1-0"]
[BlackElo "2660"]
[ECO "D59n"]
[WhiteElo "2785"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5
Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6
15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21.
f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7
28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34.
R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40.
Bc4 Kh8 41. Qf4 1-0`,
		movelist : "c4.e6.Nf3.d5.d4.Nf6.Nc3.Be7.Bg5.OO.e3.h6.Bh4.b6.cxd5.Nxd5.Bxe7.Qxe7.Nxd5.exd5.Rc1.Be6.Qa4.c5.Qa3.Rc8.Bb5.a6.dxc5.bxc5.OO.Ra7.Be2.Nd7.Nd4.Qf8.Nxe6.fxe6.e4.d4.f4.Qe7.e5.Rb8.Bc4.Kh8.Qh3.Nf8.b3.a5.f5.exf5.Rxf5.Nh7.Rcf1.Qd8.Qg3.Re7.h4.Rbb7.e6.Rbc7.Qe5.Qe8.a4.Qd8.R1f2.Qe8.R2f3.Qd8.Bd3.Qe8.Qe4.Nf6.Rxf6.gxf6.Rxf6.Kg8.Bc4.Kh8.Qf4"
	}
];