import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

import { useWebhooks } from './hooks/useWebhooks';
import WebhookTable from './components/WebhookTable';
import WebhookForm from './components/WebhookForm';
import ConfirmDialog from './components/ConfirmDialog';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function App() {
  const { t } = useTranslation();
  const { webhooks, loading, fetchAll, create, update, remove, fire } = useWebhooks();

  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [deletingWebhook, setDeletingWebhook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAll().catch(() => toast.error(t('webhooks.error.load')));
  }, [fetchAll, t]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setEditingWebhook(null);
    setShowForm(true);
  };

  const handleEdit = (webhook) => {
    setEditingWebhook(webhook);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingWebhook(null);
  };

  const handleSave = async (data) => {
    setFormLoading(true);
    try {
      if (editingWebhook) {
        await update(editingWebhook.Id, data);
        toast.success(t('webhooks.success.updated'));
      } else {
        await create(data);
        toast.success(t('webhooks.success.created'));
      }
      handleFormClose();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRequest = (webhook) => {
    setDeletingWebhook(webhook);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await remove(deletingWebhook.Id);
      toast.success(t('webhooks.success.deleted'));
      setDeletingWebhook(null);
    } catch {
      toast.error(t('webhooks.error.delete'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFire = async (id) => {
    try {
      const result = await fire(id);
      toast.success(
        t('webhooks.success.fired', {
          status: result.status,
          statusText: result.statusText,
        }),
        { duration: 4000 }
      );
    } catch (err) {
      const key = err.response?.data?.error || 'webhooks.error.fire';
      toast.error(t(key));
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight tracking-tight text-gray-900">
                {t('app.title')}
              </h1>
              <p className="text-xs text-gray-400">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              id="add-webhook-btn"
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('actions.add')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            {webhooks.length > 0 && `${webhooks.length} webhook${webhooks.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <WebhookTable
          webhooks={webhooks}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onFire={handleFire}
        />
      </main>

      {/* Modals */}
      {showForm && (
        <WebhookForm
          webhook={editingWebhook}
          onSave={handleSave}
          onClose={handleFormClose}
          loading={formLoading}
        />
      )}

      {deletingWebhook && (
        <ConfirmDialog
          webhook={deletingWebhook}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingWebhook(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
