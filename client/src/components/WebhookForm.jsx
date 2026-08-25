import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EMPTY_FORM = { Name: '', Description: '', URL: '' };

export default function WebhookForm({ webhook, onSave, onClose, loading }) {
  const { t } = useTranslation();
  const isEdit = Boolean(webhook);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (webhook) {
      setForm({ Name: webhook.Name, Description: webhook.Description, URL: webhook.URL });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [webhook]);

  const validate = () => {
    const errs = {};
    if (!form.Name.trim()) errs.Name = t('validation.required');
    else if (form.Name.length > 120) errs.Name = t('validation.nameTooLong');

    if (!form.URL.trim()) {
      errs.URL = t('validation.required');
    } else {
      try {
        const u = new URL(form.URL.trim());
        if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
      } catch {
        errs.URL = t('validation.invalidUrl');
      }
    }

    if (form.Description.length > 500) errs.Description = t('validation.descriptionTooLong');
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSave(form);
    } catch (err) {
      const serverError = err.response?.data?.error;
      if (serverError === 'webhooks.error.nameTaken') {
        setErrors({ Name: t('webhooks.error.nameTaken') });
      } else if (err.response?.data?.errors) {
        const mapped = {};
        err.response.data.errors.forEach((e) => {
          mapped[e.path] = t(e.msg);
        });
        setErrors(mapped);
      }
    }
  };

  const fieldClass = (hasError) =>
    `block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150
    focus:ring-2 focus:ring-brand-500 focus:border-transparent
    ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`;

  return (
    <div
      id="webhook-form-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? t('webhooks.editTitle') : t('webhooks.addTitle')}
          </h2>
          <button
            id="form-close-btn"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form id="webhook-form" onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="field-name" className="mb-1.5 block text-xs font-medium text-gray-600 uppercase tracking-wide">
              {t('webhooks.name')} <span className="text-red-400">*</span>
            </label>
            <input
              id="field-name"
              name="Name"
              type="text"
              value={form.Name}
              onChange={handleChange}
              placeholder={t('webhooks.namePlaceholder')}
              className={fieldClass(errors.Name)}
              maxLength={120}
              autoFocus
            />
            {errors.Name && <p className="mt-1 text-xs text-red-500">{errors.Name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="field-description" className="mb-1.5 block text-xs font-medium text-gray-600 uppercase tracking-wide">
              {t('webhooks.description')}
            </label>
            <textarea
              id="field-description"
              name="Description"
              value={form.Description}
              onChange={handleChange}
              placeholder={t('webhooks.descriptionPlaceholder')}
              rows={2}
              className={fieldClass(errors.Description)}
              maxLength={500}
            />
            {errors.Description && <p className="mt-1 text-xs text-red-500">{errors.Description}</p>}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="field-url" className="mb-1.5 block text-xs font-medium text-gray-600 uppercase tracking-wide">
              {t('webhooks.url')} <span className="text-red-400">*</span>
            </label>
            <input
              id="field-url"
              name="URL"
              type="url"
              value={form.URL}
              onChange={handleChange}
              placeholder={t('webhooks.urlPlaceholder')}
              className={fieldClass(errors.URL)}
            />
            {errors.URL && <p className="mt-1 text-xs text-red-500">{errors.URL}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              id="form-cancel-btn"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              id="form-save-btn"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-60"
            >
              {loading && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
