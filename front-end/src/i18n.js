import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { translateText } from "./services/translationService";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
      wait: true,
    },
    saveMissing: true,
    missingKeyHandler: async (languages, namespace, key, fallbackValue) => {
      if (i18n.language !== "en") {
        try {
          const translationText = fallbackValue || key;
          const translated = await translateText(
            translationText,
            i18n.language,
            "en"
          );
          i18n.addResource(i18n.language, namespace, key, translated);
          i18n.reloadResources(i18n.language, namespace);
        } catch (error) {
          console.error("Translation error:", error);
        }
      }
    },
  });


const preloadTranslations = async () => {
  const languagesToPreload = ["es", "fr", "de", "it", "tr", "ja", "zh"];
  const currentLanguage = i18n.language;
  const namespace = "translation";
  const fallbackResources = i18n.getResourceBundle("en", namespace);
  const keys = Object.keys(fallbackResources);

  const prioritizedLanguages =
    currentLanguage !== "en"
      ? [
          currentLanguage,
          ...languagesToPreload.filter((lang) => lang !== currentLanguage),
        ]
      : languagesToPreload;

  for (const lang of prioritizedLanguages) {
    if (lang === "en") continue;

    await Promise.all(
      keys.map(async (key) => {
        try {
          const translated = await translateText(
            fallbackResources[key],
            lang,
            "en"
          );
          i18n.addResource(lang, namespace, key, translated);
        } catch (error) {
          console.error(
            `Error preloading translation for key "${key}" in ${lang}:`,
            error
          );
        }
      })
    );
  }
};

i18n.on("initialized", () => {
  preloadTranslations();
});

export default i18n;
