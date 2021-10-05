module Types
	module Models
		class RepertoireType < Types::BaseObject
			class QueueItem < Types::BaseObject
				field :id, ID, null: false
				field :parent_id, String, null: true
				field :move, String, null: false
				field :uci, String, null: false
				field :movelist, String, null: false
			end

			field :id, ID, null: false
			field :name, String, null: false
			field :slug, String, null: false
			field :created_at, GraphQL::Types::ISO8601DateTime, null: false
			field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
			field :side, String, null: false
			field :lesson_queue, [QueueItem], null: true
			field :lesson_queue_length, Int, null: true

			# Relationships
			field :user, Types::Models::UserType, null: true
			field :moves, [Types::Models::MoveType], null: true
		end
	end
end
