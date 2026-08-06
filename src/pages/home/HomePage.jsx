import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth.js';
import './homePage.css';

const FEATURES = [
  {
    number: '01',
    title: 'Create with clarity',
    text: 'Build shipments, add cargo specifications, and receive transparent pricing in one guided flow.',
    icon: '↗',
  },
  {
    number: '02',
    title: 'Verify every detail',
    text: 'Coordinate containers, cargo checks, documents, and payments through a controlled review sequence.',
    icon: '✓',
  },
  {
    number: '03',
    title: 'Move with confidence',
    text: 'Track status, preserve the operational record, and generate final shipping documentation.',
    icon: '◎',
  },
];

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath =
    user?.role === 'ROLE_ADMIN' ? '/admin/shipments' : '/client/shipments';

  return (
    <main className="cargo-home">
      <nav className="cargo-nav" aria-label="Primary navigation">
        <Link to="/" className="cargo-brand">
          <span className="cargo-brand-mark">C</span>
          <span>CargoSphere</span>
        </Link>

        <div className="cargo-nav-links">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#network">Network</a>
        </div>

        <div className="cargo-nav-actions">
          {isAuthenticated ? (
            <Link to={dashboardPath} className="cargo-button cargo-button-light">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="cargo-signin">Sign in</Link>
              <Link to="/register" className="cargo-button cargo-button-light">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="cargo-hero" id="platform">
        <div className="cargo-orbit cargo-orbit-one" />
        <div className="cargo-orbit cargo-orbit-two" />

        <div className="cargo-eyebrow">
          <span /> Modern freight operations
        </div>
        <h1>
          Every shipment.
          <span>One intelligent sphere.</span>
        </h1>
        <p className="cargo-hero-copy">
          CargoSphere brings booking, verification, documents, payments, and
          delivery visibility into one precise logistics workspace.
        </p>

        <div className="cargo-hero-actions">
          <Link
            to={isAuthenticated ? dashboardPath : '/register'}
            className="cargo-button cargo-button-accent"
          >
            {isAuthenticated ? 'Go to dashboard' : 'Start shipping'}
            <span aria-hidden="true">↗</span>
          </Link>
          <a href="#workflow" className="cargo-button cargo-button-ghost">
            Explore platform
          </a>
        </div>

        <div className="cargo-dashboard-stage" aria-label="CargoSphere product preview">
          <div className="cargo-glow" />
          <div className="cargo-preview cargo-preview-main">
            <div className="cargo-preview-topbar">
              <div>
                <span className="cargo-preview-kicker">LIVE SHIPMENT</span>
                <strong>CS-2026-31532317</strong>
              </div>
              <span className="cargo-status"><i /> In transit</span>
            </div>

            <div className="cargo-route">
              <div>
                <small>ORIGIN</small>
                <strong>Pune</strong>
                <span>06 AUG · 09:30</span>
              </div>
              <div className="cargo-route-line">
                <span>SEA</span>
                <i />
              </div>
              <div className="text-end">
                <small>DESTINATION</small>
                <strong>Mumbai</strong>
                <span>24 AUG · 16:00</span>
              </div>
            </div>

            <div className="cargo-metrics">
              <div><small>CARGO WEIGHT</small><strong>25.000 <em>kg</em></strong></div>
              <div><small>TOTAL VOLUME</small><strong>1.220 <em>CBM</em></strong></div>
              <div><small>DOCUMENTS</small><strong>5 / 5 <em>verified</em></strong></div>
              <div><small>SHIPMENT VALUE</small><strong>₹967.25</strong></div>
            </div>

            <div className="cargo-progress">
              {['Booked', 'Allocated', 'Verified', 'Documents', 'Payment'].map((step) => (
                <div key={step}><i>✓</i><span>{step}</span></div>
              ))}
            </div>
          </div>

          <div className="cargo-float-card cargo-float-left">
            <span className="cargo-mini-icon">▦</span>
            <div><small>CONTAINER</small><strong>MSCU 482901</strong></div>
            <span className="cargo-pill">Ready</span>
          </div>

          <div className="cargo-float-card cargo-float-right">
            <span className="cargo-mini-icon cargo-mini-icon-gold">₹</span>
            <div><small>PAYMENT</small><strong>Balance cleared</strong></div>
            <span className="cargo-check">✓</span>
          </div>
        </div>
      </section>

      <section className="cargo-proof" id="network">
        <span>BUILT FOR MODERN LOGISTICS TEAMS</span>
        <div className="cargo-proof-items">
          <strong>Freight forwarders</strong><i />
          <strong>Export teams</strong><i />
          <strong>Operations leaders</strong><i />
          <strong>Growing businesses</strong>
        </div>
      </section>

      <section className="cargo-workflow" id="workflow">
        <div className="cargo-section-heading">
          <div>
            <span className="cargo-section-label">THE WORKFLOW</span>
            <h2>Complex logistics,<br />made beautifully simple.</h2>
          </div>
          <p>
            One connected experience from shipment creation to final eBill—
            built for speed, accountability, and complete operational control.
          </p>
        </div>

        <div className="cargo-feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.number} className="cargo-feature-card">
              <div className="cargo-feature-top">
                <span>{feature.number}</span>
                <i>{feature.icon}</i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="cargo-footer">
        <div className="cargo-brand"><span className="cargo-brand-mark">C</span><span>CargoSphere</span></div>
        <p>Precision in motion.</p>
        <span>© 2026 CargoSphere</span>
      </footer>
    </main>
  );
}

export default HomePage;
