class CreateMasterGameNames < ActiveRecord::Migration[6.1]
	def change
		enable_extension "unaccent" unless extension_enabled?("unaccent")

		execute "
			CREATE OR REPLACE FUNCTION GET_SEARCHABLE_NAMES(name VARCHAR) RETURNS VARCHAR[] AS $$
			DECLARE
				has_comma BOOLEAN;
				val VARCHAR[];
				result VARCHAR[];
			BEGIN
				has_comma := name LIKE '%,%';
				name      := LOWER(REPLACE(UNACCENT(name), ',', ''));
				val       := ARRAY_REMOVE(STRING_TO_ARRAY(name, ' ', ''), NULL);
				
				IF NOT has_comma THEN
					val := ARRAY
						(
							SELECT
								val[i]
							FROM
								GENERATE_SUBSCRIPTS(val, 1) AS s(i)
							ORDER BY
								i DESC
						);
				ELSIF CARDINALITY(val) > 2 THEN
					val := val[1:2];
				END IF;
				
				result = ARRAY_APPEND(result, ARRAY_TO_STRING(val, '')::VARCHAR);
				
				IF CARDINALITY(val) > 1 THEN
					result = ARRAY_APPEND(result, CONCAT(val[1], val[CARDINALITY(val)])::VARCHAR);
					result = ARRAY_APPEND(result, CONCAT(val[1], SUBSTRING(val[CARDINALITY(val)], 1, 1))::VARCHAR);
				END IF;
				
				result := ARRAY
					(
						SELECT DISTINCT
							result[i]
						FROM
							GENERATE_SUBSCRIPTS(result, 1) AS s(i)
						ORDER BY
							1
					);
				
				RETURN result;
			END
			$$ LANGUAGE plpgsql;
		"

		create_view :master_game_names, materialized: true
		add_index :master_game_names, [:master_game_id, :side], unique: true
	end
end
