class ImportRepertoirePgn
	include Interactor

	def call
		begin
			res = `python3 #{__dir__}/../python/import_repertoire_pgn.py "#{context.repertoire_id}" "#{context.file}"`
			res = res.strip

			context.result = (res == "False") ? false : res
		rescue
			context.result = false
		end
	end
end