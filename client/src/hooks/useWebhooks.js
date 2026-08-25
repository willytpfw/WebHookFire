import { useState, useCallback } from 'react';
import {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  fireWebhook,
} from '../api/webhooksApi';

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWebhooks();
      setWebhooks(data);
    } catch (err) {
      setError(err.response?.data?.error || 'webhooks.error.load');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data) => {
    const created = await createWebhook(data);
    setWebhooks((prev) => [...prev, created]);
    return created;
  }, []);

  const update = useCallback(async (id, data) => {
    const updated = await updateWebhook(id, data);
    setWebhooks((prev) => prev.map((w) => (w.Id === id ? updated : w)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteWebhook(id);
    setWebhooks((prev) => prev.filter((w) => w.Id !== id));
  }, []);

  const fire = useCallback(async (id) => {
    return await fireWebhook(id);
  }, []);

  return { webhooks, loading, error, fetchAll, create, update, remove, fire };
}
