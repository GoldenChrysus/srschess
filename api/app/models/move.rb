class Move < ApplicationRecord
	# Validation
	validates :repertoire, presence: true
	validates :move_number, presence: true
	validates :move, presence: true
	validates :fen, presence: true
	validates :uci, presence: true
	validates :sort, presence: true

	belongs_to :repertoire, required: true
	belongs_to :parent, class_name: "Move", required: false
	has_many :moves, inverse_of: "parent", foreign_key: :parent_id

	# Callbacks
	before_validation :set_sort, on: :create
	after_validation :set_id, on: :create

	def self.attributes_protected_by_default
		# default is ["id", "type"]
		["type"]
	end

	private
		def set_id
			hash = Digest::MD5.hexdigest (self.repertoire.id.to_s + ":" + self.move_number.to_s + ":" + self.move + ":" + self.fen)
			
			self.id = ([hash[0, 8], hash[8, 4], hash[12, 4], hash[16, 4], hash[20..-1]]).join("-")
		end

		def set_sort
			move = self.class.where({ move_number: self.move_number }).order(sort: :desc).first

			self.sort = (move != nil) ? move.sort + 1 : 0
		end
end
