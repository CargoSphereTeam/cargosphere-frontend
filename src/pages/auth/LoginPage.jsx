import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth.js';
import { getApiErrorDetails } from '../../utils/apiError.js';
import './authTheme.css';

const INITIAL_FORM = {
  email: '',
  password: '',
};

function getAuthenticatedDestination(role) {
  if (role === 'ROLE_ADMIN') {
    return '/admin/dashboard';
  }

  return '/client/shipments';
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setValidationErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));

    setErrorMessage('');
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    }

    setValidationErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const authenticatedUser = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate(
        getAuthenticatedDestination(authenticatedUser.role),
        { replace: true },
      );
    } catch (error) {
      const apiError = getApiErrorDetails(
        error,
        'Unable to sign in. Please try again.',
      );

      setErrorMessage(apiError.message);
      setValidationErrors(apiError.validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="cargo-auth">
      <div className="cargo-auth-orbit" />
      <Link to="/" className="cargo-auth-brand">
        <span>C</span> CargoSphere
      </Link>
      <div className="container cargo-auth-container">
        <div className="row g-0 cargo-auth-shell">
          <div className="col-lg-6 cargo-auth-visual">
            <span className="cargo-auth-label">SECURE LOGISTICS WORKSPACE</span>
            <h1>Move freight.<br /><em>Stay in control.</em></h1>
            <p>One precise view across cargo, documents, payments, and every operational milestone.</p>
            <div className="cargo-auth-route-card">
              <div><small>ORIGIN</small><strong>Pune</strong></div>
              <div className="cargo-auth-route-line"><i /></div>
              <div className="text-end"><small>DESTINATION</small><strong>Mumbai</strong></div>
            </div>
            <div className="cargo-auth-stat-row">
              <div><small>DOCUMENTS</small><strong>5 / 5</strong><span>Verified</span></div>
              <div><small>PAYMENT</small><strong>₹967.25</strong><span>Cleared</span></div>
            </div>
          </div>

          <div className="col-12 col-lg-6 cargo-auth-form-column">
            <div className="cargo-auth-mobile-brand">CargoSphere</div>

            <div className="card cargo-auth-card">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <span className="cargo-auth-step">WELCOME BACK</span>
                  <h2 className="mb-2">Sign in to CargoSphere</h2>
                  <p className="cargo-auth-muted mb-0">
                    Enter your credentials to continue to your workspace.
                  </p>
                </div>

                {errorMessage ? (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor="email"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${
                        validationErrors.email
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />

                    {validationErrors.email ? (
                      <div className="invalid-feedback">
                        {validationErrors.email}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="password"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control ${
                        validationErrors.password
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />

                    {validationErrors.password ? (
                      <div className="invalid-feedback">
                        {validationErrors.password}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="cargo-auth-submit w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>

                <p className="text-center cargo-auth-muted mt-4 mb-0">
                  New to CargoSphere?{' '}
                  <Link to="/register">Create an account</Link>
                </p>
              </div>
            </div>

            <p className="text-center cargo-auth-muted small mt-4 mb-0">
              Protected by CargoSphere secure access.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
