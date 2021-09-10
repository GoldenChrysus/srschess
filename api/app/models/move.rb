class Move < ApplicationRecord
	# Validation
	validates :repertoire, presence: true
	validates :move_number, presence: true
	validates :move, presence: true
	validates :fen, presence: true
	validates :sort, presence: true

	belongs_to :repertoire, required: true
	belongs_to :parent, class_name: "Move"
	has_many :moves, inverse_of: "parent"

	# Callbacks
	after_validation :set_id, on: :create

	private
		def set_id
			hash = Digest::MD5.hexdigest (self.repertoire.id.to_s + ":" + self.move_number.to_s + ":" + self.move)
			
			self.id = ([hash[0, 8], hash[8, 4], hash[12, 4], hash[16, 4], hash[20..-1]]).join("-")
		end
end
