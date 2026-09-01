import { useTranslation } from 'react-i18next';
import WebhookRow from './WebhookRow';
import EmptyState from './EmptyState';

export default function WebhookTable({ webhooks, loading, onAdd, onEdit, onDelete, onFire }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (webhooks.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="px-2 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t('webhooks.name')}
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map((wh) => (
            <WebhookRow
              key={wh.Id}
              webhook={wh}
              onEdit={onEdit}
              onDelete={onDelete}
              onFire={onFire}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
