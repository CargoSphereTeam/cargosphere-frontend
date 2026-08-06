import { Link } from 'react-router-dom';

function AccessDeniedPage() {
  return (
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container text-center">
        <div className="mx-auto" style={{ maxWidth: '560px' }}>
          <p className="text-danger fw-semibold mb-2">
            Error 403
          </p>

          <h1 className="display-6 fw-bold mb-3">
            Access denied
          </h1>

          <p className="text-secondary mb-4">
            Your CargoSphere account does not have permission
            to access this page.
          </p>

          <Link to="/" className="btn btn-primary">
            Return to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AccessDeniedPage;
