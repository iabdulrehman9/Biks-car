import { useState, useEffect } from 'react';
import { Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { login, getUser } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

interface SessionExpiredModalProps {
  onSuccess?: () => void;
}

export function SessionExpiredModal({ onSuccess }: SessionExpiredModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentUser = getUser() || 'biksss@gmail.com';

  useEffect(() => {
    const handleExpired = () => {
      setIsOpen(true);
      setError('');
      setSuccess(false);
    };

    window.addEventListener('biks:session_expired', handleExpired);
    return () => {
      window.removeEventListener('biks:session_expired', handleExpired);
    };
  }, []);

  if (!isOpen) return null;

  const handleReAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');
    try {
      await login(currentUser, password);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setPassword('');
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setError(err.message || t('admin.loginFailed', 'Invalid password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1528] p-6 shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">
              {t('admin.sessionExpired', 'Session Re-authentication')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('admin.sessionDesc', 'Your session expired. Re-enter password to continue without losing your changes.')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-2 animate-bounce" />
            <p className="text-sm font-bold text-emerald-400">
              {t('admin.sessionRestored', 'Session restored! Resuming...')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleReAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('admin.account', 'Account')}
              </label>
              <input
                type="text"
                disabled
                value={currentUser}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('admin.password', 'Password')}
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#D0A030] px-5 py-2 text-xs font-bold text-[#001030] hover:bg-[#E5B545] transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{t('admin.unlockSession', 'Verify & Continue')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
