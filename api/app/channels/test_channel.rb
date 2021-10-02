require "redis"

class TestChannel < ApplicationCable::Channel
	@@red = nil
	@@subber = []

	def subscribed
		channel = "test_channel:" + params[:channelId]

		stream_from channel

		@@subber.append(channel)

		@@red = Redis.new(url: "redis://localhost:6379/1")

		@@red.subscribe(channel) do |on|
			puts "OK1"
			on.message do |channel, message|
				puts "onms"
				puts @@subber
				ActionCable.server.broadcast(channel, message)
			end
			@@red.publish(channel, "OK2")
		end
	end

	def unsubscribed
		puts "unsub"
	end

	def receive(message)
		puts message
		puts @@subber
		channel = "test_channel:" + params[:channelId]

		puts channel

		@@red = Redis.new(url: "redis://localhost:6379/1")
		@@red.publish(channel, message.to_json)
	end
end