class MasterDbRecord < ApplicationRecord
	self.abstract_class = true

	connects_to database: { writing: :master_games, reading: :master_games }
end