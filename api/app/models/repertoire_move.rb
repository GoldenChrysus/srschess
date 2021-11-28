class RepertoireMove < ApplicationRecord
	# Validation
	validates :repertoire, presence: true
	validates :move_number, presence: true
	validates :move, presence: true
	validates :fen, presence: true
	validates :uci, presence: true
	validates :sort, presence: true

	# Relationships
	belongs_to :repertoire, required: true
	belongs_to :parent, class_name: "RepertoireMove", required: false
	belongs_to :transposition, class_name: "RepertoireMove", required: false
	has_many :moves, class_name: "RepertoireMove", inverse_of: "parent", foreign_key: :parent_id
	has_many :transpositions, class_name: "RepertoireMove", inverse_of: "transposition", foreign_key: :transposition_id
	has_one :learned_item, required: false, dependent: :destroy
	has_one :note, class_name: "RepertoireMoveNote", inverse_of: "move", required: false, dependent: :destroy

	# Callbacks
	before_validation :set_sort, on: :create
	after_validation :set_id, on: :create
	before_destroy :update_dependents
	before_save :resort_tier, if: :sort_changed?

	def self.attributes_protected_by_default
		# default is ["id", "type"]
		["type"]
	end

	private
		def set_id
			id   = if self.repertoire != nil then self.repertoire.id.to_s else "" end
			hash = Digest::MD5.hexdigest (id + ":" + self.move_number.to_s + ":" + self.move + ":" + self.fen)
			
			self.id = ([hash[0, 8], hash[8, 4], hash[12, 4], hash[16, 4], hash[20..-1]]).join("-")
		end

		def set_sort
			return unless self.sort == nil

			move = self
				.class
				.where({ move_number: self.move_number, repertoire: self.repertoire })
				.order(sort: :desc).first

			self.sort = (move != nil) ? move.sort + 1 : 0
		end

		def update_dependents
			# Move moves on same tier up by sort
			self
				.repertoire
				.moves
				.where("move_number = :move_number AND sort > :sort", move_number: self.move_number, sort: self.sort)
				.each do |move|
					move.sort -= 1

					move.save
			end

			# Reset transpositions
			self.transpositions.each do |move|
				move.transposition = nil

				move.save
			end

			# Destroy children
			self.moves.each do |move|
				move.destroy
			end
		end

		def resort_tier
			sort = 0

			self
				.repertoire
				.moves
				.where("move_number = :move_number AND id != :id", move_number: self.move_number, id: self.id)
				.each do |move|
					if (move.sort == self.sort)
						sort += 1
					end

					move.sort = sort

					sort += 1

					move.save
			end
		end
end
