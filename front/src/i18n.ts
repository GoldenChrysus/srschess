import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

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
		fallbackLng: "en",
		ns: ["chess", "common", "repertoires"],
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;