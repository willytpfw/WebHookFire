import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || 'en';

  const toggle = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      {['en', 'es'].map((lang) => (
        <button
          key={lang}
          id={`lang-${lang}`}
          onClick={() => toggle(lang)}
          className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200
            ${current === lang
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
