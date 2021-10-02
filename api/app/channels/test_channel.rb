class TestChannel < ApplicationCable::Channel
	def subscribed
		stream_from "test_channel:" + params[:channelId]

		puts params
		puts "OK"

		ActionCable.server.broadcast("test_channel:" + params[:channelId], { data: "OK" })
	end
end