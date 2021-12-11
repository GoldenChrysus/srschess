class MasterGame < MasterDbRecord
	self.table_name = "master_games.master_games"

	# Validation
	validates :movelist, presence: true
	validates :white, presence: true
	validates :black, presence: true
	validates :white_elo, presence: true
	validates :black_elo, presence: true
	validates :result, presence: true
	validates :pgn, presence: true
	validates :source, presence: true

	# Relationships
	has_many :master_game_moves

	# Types
	enum result: {white: 1, black: 0, draw: 2}
	enum source: {local: 0, pgnmentor: 1, chessbomb: 2, caissabase: 3}
end
