import { useTranslation } from 'react-i18next';
import { LinkIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ onAdd }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <LinkIcon className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-gray-800">
        {t('webhooks.empty')}
      </h3>
      <p className="mb-6 text-sm text-gray-400">{t('webhooks.emptyDescription')}</p>
      <button
        id="empty-add-btn"
        onClick={onAdd}
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-700 active:scale-95"
      >
        {t('actions.add')}
      </button>
    </div>
  );
}
