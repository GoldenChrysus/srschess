module Api
	class RepertoireResource < JSONAPI::Resource
		attributes :name, :side, :created_at

		belongs_to :user
	end
end