import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useApp } from '../../context/AppContext';
import UserAvatar from '../UserAvatar';

export default function AuthDialog() {
  const { authOpen, setAuthOpen, session, login, register, logout } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Demo Student',
    email: 'student@campus.edu',
    password: 'nexusdemo'
  });

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === 'register') {
      await register(form);
      return;
    }

    await login(form);
  };

  return (
    <AnimatePresence>
      {authOpen ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthOpen(false)}
        >
          <motion.div
            className="auth-dialog"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="auth-header">
              <div>
                <p className="panel-eyebrow">Session</p>
                <h2 className="panel-title">NEXUS access</h2>
              </div>
              <button type="button" className="secondary-button" onClick={() => setAuthOpen(false)}>
                Close
              </button>
            </div>

            {!session.meta?.guest ? (
              <div className="auth-summary">
                <div className="auth-current-user">
                  <UserAvatar seed={session.user?.username || session.user?.name} name={session.user?.name} size={48} />
                  <div>
                    <p className="auth-current-name">{session.user.name}</p>
                    <p className="auth-current-email">{session.user.email}</p>
                  </div>
                </div>
                <button type="button" className="primary-button" onClick={logout}>
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <div className="auth-tabs">
                  <button type="button" className={mode === 'login' ? 'tab-button is-active' : 'tab-button'} onClick={() => setMode('login')}>
                    Sign in
                  </button>
                  <button type="button" className={mode === 'register' ? 'tab-button is-active' : 'tab-button'} onClick={() => setMode('register')}>
                    Register
                  </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {mode === 'register' ? (
                    <label>
                      Name
                      <input value={form.name} onChange={handleChange('name')} />
                    </label>
                  ) : null}

                  <label>
                    Email
                    <input type="email" value={form.email} onChange={handleChange('email')} />
                  </label>

                  <label>
                    Password
                    <input type="password" value={form.password} onChange={handleChange('password')} />
                  </label>

                  <button type="submit" className="primary-button">
                    {mode === 'register' ? 'Create account' : 'Enter workspace'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
