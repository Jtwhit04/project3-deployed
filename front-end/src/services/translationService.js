import axios from "axios";

const translateText = async (text, targetLanguage, sourceLanguage = "auto") => {
  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const data = res.data;
    if (data && data[0] && data[0][0]) {
      const translatedText = data[0][0][0];
      return translatedText;
    }

    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export { translateText };
