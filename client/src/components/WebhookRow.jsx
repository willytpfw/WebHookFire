import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BoltIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function WebhookRow({ webhook, onEdit, onDelete, onFire }) {
  const { t } = useTranslation();
  const [firing, setFiring] = useState(false);

  const handleFire = async () => {
    setFiring(true);
    try {
      await onFire(webhook.Id);
    } finally {
      setFiring(false);
    }
  };

  return (
    <tr className="group border-b border-gray-100 transition-colors hover:bg-gray-50/60">
      {/* Name */}
      <td className="px-4 py-3.5">
        <span className="block text-sm font-semibold text-gray-900">{webhook.Name}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          {/* Fire */}
          <button
            id={`fire-btn-${webhook.Id}`}
            onClick={handleFire}
            disabled={firing}
            title={t('webhooks.fire')}
            className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-all hover:bg-brand-100 active:scale-95 disabled:opacity-50"
          >
            {firing ? (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <BoltIcon className="h-3.5 w-3.5" />
            )}
            {t('webhooks.fire')}
          </button>

          {/* Edit */}
          <button
            id={`edit-btn-${webhook.Id}`}
            onClick={() => onEdit(webhook)}
            title={t('webhooks.edit')}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            id={`delete-btn-${webhook.Id}`}
            onClick={() => onDelete(webhook)}
            title={t('webhooks.delete')}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
