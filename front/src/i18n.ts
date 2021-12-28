import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

const ALLOWED_LOCALES: Array<string> = [
	"en",
	"ja"
];

let saved_locale = localStorage.getItem("locale") ?? "en";

if (!ALLOWED_LOCALES.includes(saved_locale)) {
	saved_locale = "en";
}

i18n
	.use(resourcesToBackend((language, namespace, callback) => {
		import("./assets/locales/" + namespace + "/" + language + ".json")
			.then((resources) => {
				callback(null, resources);
			})
			.catch((error) => {
				callback(error, null);
			})
	}))
	.use(initReactI18next)
	.init({
		react: {
			useSuspense: false
		},
		fallbackLng   : "en",
		lng           : saved_locale,
		ns            : ["chess", "common", "repertoires", "errors"],
		interpolation : {
			escapeValue : false,
			format      : function(value, format, lng) {
				if (format === "lowercase") {
					value = (value ?? "").toLowerCase();
				}

				return value;
			}
		}
	});

export default i18n;