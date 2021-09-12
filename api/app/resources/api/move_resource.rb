module Api
	class MoveResource < JSONAPI::Resource
		attributes :move_number, :move, :fen, :sort, :created_at

		belongs_to :repertoire
		belongs_to :move
		has_many :moves

		filters :repertoire

		def self.creatable_fields(context)
			super + [:id]
		  end
	end
end