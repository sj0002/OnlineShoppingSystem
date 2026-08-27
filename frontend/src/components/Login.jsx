import React, { useState } from 'react';

function Login({ onSubmit }) {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password, role });
    }
  };

  return (
    <div style={styles.loginPage}>
      {/* App.js එකේ Navbar එකක් දැනටමත් තියෙන නිසා මෙතන තිබ්බ Header එක අයින් කළා */}
      
      <main style={styles.loginMain}>
        <section style={styles.loginCard} aria-labelledby="login-title">
          
          <div style={styles.loginTabs}>
            <div style={{...styles.loginTab, ...styles.loginTabActive}}>Login</div>
            <div style={styles.loginTab}>Register</div>
          </div>

          <h1 id="login-title" style={styles.title}>Welcome Back</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <fieldset style={styles.roleSelection}>
              <legend style={{ display: 'none' }}>Account type</legend>
              {['customer', 'seller', 'admin'].map((accountRole) => (
                <label key={accountRole} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="user_type"
                    value={accountRole}
                    checked={role === accountRole}
                    onChange={(event) => setRole(event.target.value)}
                    style={styles.radioInput}
                  />
                  {accountRole[0].toUpperCase() + accountRole.slice(1)}
                </label>
              ))}
            </fieldset>

            <div style={styles.loginFields}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>LOG IN</button>
          </form>
        </section>
      </main>
    </div>
  );
}

// වර්ණ සහ හැඩතල (Header Styles අයින් කර ඇත)
const styles = {
  loginPage: {
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  loginMain: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  loginCard: {
    backgroundColor: '#111111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  },
  loginTabs: {
    display: 'flex',
    borderBottom: '1px solid #333',
    marginBottom: '30px',
  },
  loginTab: {
    flex: 1,
    textAlign: 'center',
    padding: '12px 0',
    color: '#888',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loginTabActive: {
    color: '#fff',
    borderBottom: '2px solid #fff',
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  roleSelection: {
    border: 'none',
    padding: 0,
    margin: '0 0 25px 0',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#ccc',
  },
  radioInput: {
    marginRight: '8px',
    accentColor: '#3b82f6',
  },
  loginFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
  },
  input: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#000',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

export default Login;