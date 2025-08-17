import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./locales/de";
import en from "./locales/en";
import { supabase } from "@/integrations/supabase/client";

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    lng: "de",
    fallbackLng: "en",
    debug: false, // Disable debug in production
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false
    },
    // Add missing key handler for better debugging
    missingKeyHandler: (lng: any, ns: any, key: any) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
    }
  });

// Sync language changes to Supabase user metadata
try {
  i18n.on('languageChanged', (lng) => {
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.updateUser({ data: { locale: (lng === 'en' ? 'en' : 'de') } });
        }
      } catch (_) {
        // noop
      }
    }, 0);
  });
} catch (_) {
  // noop
}


export default i18n;
