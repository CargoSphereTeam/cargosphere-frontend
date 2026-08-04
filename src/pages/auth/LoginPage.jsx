import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth.js';
import { getApiErrorDetails } from '../../utils/apiError.js';

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
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="text-center mb-4">
              <h1 className="h2 fw-bold mb-2">CargoSphere</h1>
              <p className="text-secondary mb-0">
                Cargo and shipment management portal
              </p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <h2 className="h4 mb-2">Sign in</h2>
                  <p className="text-secondary mb-0">
                    Enter your registered CargoSphere credentials.
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
                    className="btn btn-primary w-100"
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
              </div>
            </div>

            <p className="text-center text-secondary small mt-4 mb-0">
              Use the account assigned by your CargoSphere administrator.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
