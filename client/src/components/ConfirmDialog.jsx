import { useTranslation, Trans } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ConfirmDialog({ webhook, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();

  return (
    <div
      id="confirm-dialog-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t('webhooks.deleteTitle')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              <Trans
                i18nKey="webhooks.deleteConfirm"
                values={{ name: webhook.Name }}
                components={{ strong: <strong className="font-semibold text-gray-800" /> }}
              />
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            id="confirm-cancel-btn"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {t('actions.cancel')}
          </button>
          <button
            id="confirm-delete-btn"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 active:scale-95 disabled:opacity-60"
          >
            {loading && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {t('actions.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
