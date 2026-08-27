import React, { useState } from 'react';

function LoginPage({ onSubmit }) {
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
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo">STOREFRONT.</div>
        <nav className="login-navigation" aria-label="Authentication navigation">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a className="cart-link" href="/cart" aria-label="Cart with 2 items">
            Cart (2)
          </a>
        </nav>
      </header>

      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-tabs">
            <a className="login-tab login-tab-active" href="/login">Login</a>
            <a className="login-tab" href="/register">Register</a>
          </div>

          <h1 id="login-title">Welcome Back</h1>

          <form onSubmit={handleSubmit}>
            <fieldset className="role-selection">
              <legend className="sr-only">Account type</legend>
              {['customer', 'seller', 'admin'].map((accountRole) => (
                <label key={accountRole}>
                  <input
                    type="radio"
                    name="user_type"
                    value={accountRole}
                    checked={role === accountRole}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  {accountRole[0].toUpperCase() + accountRole.slice(1)}
                </label>
              ))}
            </fieldset>

            <div className="login-fields">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit">LOG IN</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
