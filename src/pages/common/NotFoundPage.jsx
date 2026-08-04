import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container text-center">
        <div className="mx-auto" style={{ maxWidth: '560px' }}>
          <p className="text-primary fw-semibold mb-2">
            Error 404
          </p>

          <h1 className="display-6 fw-bold mb-3">
            Page not found
          </h1>

          <p className="text-secondary mb-4">
            The requested CargoSphere page does not exist or
            may have been moved.
          </p>

          <Link to="/" className="btn btn-primary">
            Return to CargoSphere
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
