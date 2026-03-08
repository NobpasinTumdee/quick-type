import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,

        detection: {
            order: ['cookie', 'navigator'], 
            caches: ['cookie'], // เก็บค่าที่เลือกลง Cookie
            lookupCookie: 'i18next', // ชื่อของ Cookie ที่ i18n จะใช้เก็บค่า (แก้ชื่อได้ถ้าต้องการ)
            cookieMinutes: 10080, // อายุของ Cookie (เช่น 7 วัน)
        },

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;