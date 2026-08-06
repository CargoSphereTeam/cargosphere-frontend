import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi.js';
import { getApiErrorDetails } from '../../utils/apiError.js';
import './authTheme.css';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => ({ ...current, [name]: '' }));
    setErrorMessage('');
  }

  function validateForm() {
    const errors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();

    if (fullName.length < 2 || fullName.length > 100) {
      errors.fullName = 'Full name must be between 2 and 100 characters';
    }
    if (!email) errors.email = 'Email is required';
    if (formData.password.length < 8 || formData.password.length > 72) {
      errors.password = 'Password must be between 8 and 72 characters';
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone number must contain 10 to 15 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
      });
      toast.success('Account created successfully. Sign in to continue.');
      navigate('/login', { replace: true });
    } catch (error) {
      const apiError = getApiErrorDetails(error, 'Unable to create your account. Please try again.');
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
        <div className="row g-0 cargo-auth-shell cargo-auth-shell-register">
          <div className="col-lg-5 cargo-auth-visual">
            <span className="cargo-auth-label">START YOUR JOURNEY</span>
            <h1>Shipping clarity,<br /><em>from day one.</em></h1>
            <p>Create a secure client workspace and manage every shipment from booking to final delivery.</p>
            <div className="cargo-auth-benefits">
              <div><i>✓</i><span><strong>Transparent pricing</strong><small>Calculated from real cargo data</small></span></div>
              <div><i>✓</i><span><strong>Document visibility</strong><small>Follow each verification milestone</small></span></div>
              <div><i>✓</i><span><strong>Shipment intelligence</strong><small>One view from origin to destination</small></span></div>
            </div>
          </div>

          <div className="col-12 col-lg-7 cargo-auth-form-column">
            <div className="cargo-auth-mobile-brand">CargoSphere</div>

            <div className="card cargo-auth-card">
              <div className="card-body p-4 p-lg-5">
                <span className="cargo-auth-step">CLIENT REGISTRATION</span>
                <h2 className="mb-2">Create your account</h2>
                <p className="cargo-auth-muted mb-4">Enter your details to start managing shipments.</p>

                {errorMessage ? <div className="alert alert-danger" role="alert">{errorMessage}</div> : null}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="fullName">Full name</label>
                    <input id="fullName" name="fullName" className={`form-control ${validationErrors.fullName ? 'is-invalid' : ''}`} value={formData.fullName} onChange={handleChange} autoComplete="name" disabled={isSubmitting} />
                    {validationErrors.fullName ? <div className="invalid-feedback">{validationErrors.fullName}</div> : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={handleChange} autoComplete="email" disabled={isSubmitting} />
                    {validationErrors.email ? <div className="invalid-feedback">{validationErrors.email}</div> : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="phoneNumber">Phone number <span className="text-secondary">(optional)</span></label>
                    <input id="phoneNumber" name="phoneNumber" type="tel" className={`form-control ${validationErrors.phoneNumber ? 'is-invalid' : ''}`} value={formData.phoneNumber} onChange={handleChange} autoComplete="tel" inputMode="numeric" disabled={isSubmitting} />
                    {validationErrors.phoneNumber ? <div className="invalid-feedback">{validationErrors.phoneNumber}</div> : null}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input id="password" name="password" type="password" className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`} value={formData.password} onChange={handleChange} autoComplete="new-password" disabled={isSubmitting} />
                      {validationErrors.password ? <div className="invalid-feedback">{validationErrors.password}</div> : null}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                      <input id="confirmPassword" name="confirmPassword" type="password" className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`} value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" disabled={isSubmitting} />
                      {validationErrors.confirmPassword ? <div className="invalid-feedback">{validationErrors.confirmPassword}</div> : null}
                    </div>
                  </div>

                  <button type="submit" className="cargo-auth-submit w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                  </button>
                </form>

                <p className="text-center cargo-auth-muted mt-4 mb-0">
                  Already registered? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
