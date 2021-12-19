class ProcessPgnPython
	include Interactor

	def call
		begin
			res = `python3 #{__dir__}/../python/process_pgn.py "#{context.file}"`
			res = res.strip

			context.result = (res == "False") ? false : res
		rescue
			context.result = false
		end
	end
end