import { ApiResponse, asynchandler } from "../utils/apihandler";
import axios from "axios";
import Sanscript from "@indic-transliteration/sanscript";

// Controller
export const translateController = asynchandler({
  fn: async (event, text: string) => {
    // 2. Try online translation API
    try {
      const response = await axios.post(
        "https://deep-translator-api.azurewebsites.net/google/",
        {
          source: "en",
          text: text,
          target: "hi",
        }
      );

      if (response.data.translation) {
        console.log("Online translation successful:", response.data.translation);
        return (event.returnValue = new ApiResponse(
          200,
          response.data.translation,
          "Translated online"
        ));
      }
    } catch (error) {
      console.error("Online translation failed, using offline fallback.",error);
    }

    // 3. Fallback to Sanscript
    const isAlpha = /^[a-zA-Z\s]+$/.test(text);
    const transliterated = isAlpha
      ? Sanscript.t(text, "itrans", "devanagari")
      : text;

    return (event.returnValue = new ApiResponse(
      200,
      transliterated,
      "Translated offline"
    ));
  },
});
