UPDATE master_games SET white_name = (GET_SEARCHABLE_NAMES(white))[1], black_name = (GET_SEARCHABLE_NAMES(black))[1];