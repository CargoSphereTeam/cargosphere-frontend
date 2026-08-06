import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getShipmentById,
  getShipmentEventsByShipmentId,
} from '../../api/shipmentApi.js';
import { getApiErrorDetails } from '../../utils/apiError.js';
import './shipmentEventsPage.css';

const PROCESSING_EVENTS = new Set([
  'CONTAINER_ALLOCATED',
  'ADMIN_PROCESSING_STARTED',
  'CARGO_VERIFIED',
  'DOCUMENTS_VERIFIED',
  'PAYMENT_CONFIRMED',
  'EBILL_GENERATED',
]);

function formatEventType(eventType = '') {
  return eventType.replaceAll('_', ' ');
}

function formatDateTime(value) {
  if (!value) return 'Time unavailable';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ShipmentEventsPage() {
  const { shipmentId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadTimeline() {
      setLoading(true);
      setError('');

      try {
        const [shipmentResponse, eventResponse] = await Promise.all([
          getShipmentById(shipmentId),
          getShipmentEventsByShipmentId(shipmentId),
        ]);

        if (isActive) {
          setShipment(shipmentResponse);
          setEvents(Array.isArray(eventResponse) ? eventResponse : []);
        }
      } catch (requestError) {
        if (isActive) {
          setError(getApiErrorDetails(
            requestError,
            'Unable to load shipment event history.',
          ).message);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadTimeline();
    return () => { isActive = false; };
  }, [shipmentId]);

  return (
    <main className="cargo-events-page">
      <div className="cargo-events-shell">
      <div className="cargo-events-hero">
        <Link
          to=".."
          relative="path"
          className="cargo-events-back"
        >
          &larr; Back to Shipment Details
        </Link>

        <div className="cargo-events-heading">
          <div>
            <p className="cargo-events-eyebrow"><i /> Live shipment activity</p>
            <h1>Every move,<br />in one place.</h1>
            <p className="cargo-events-number">
              {shipment?.shipmentNumber || `Shipment ${shipmentId}`}
            </p>
          </div>

          <div className="cargo-events-summary">
            <span>Current status</span>
            <strong>{formatEventType(shipment?.status || 'Loading')}</strong>
            <small>{events.length} recorded updates</small>
          </div>
        </div>
      </div>

      <section className="cargo-events-panel">
        <div className="cargo-events-panel-head">
          <div>
          <span>ACTIVITY STREAM</span>
          <h2>Shipment timeline</h2>
          </div>
          <p>
            Booking, shipment processing, payment and eBill activity
          </p>
        </div>

        <div className="cargo-events-panel-body">
          {loading ? (
            <div className="cargo-events-state"><span className="spinner-border spinner-border-sm" /> Loading shipment events...</div>
          ) : null}

          {error ? <div className="cargo-events-error">{error}</div> : null}

          {!loading && !error && events.length === 0 ? (
            <div className="cargo-events-state">
              No shipment activity has been recorded yet.
            </div>
          ) : null}

          {!loading && !error && events.length > 0 ? (
            <div className="cargo-events-timeline">
              {events.map((event, index) => {
                const isProcessingEvent = PROCESSING_EVENTS.has(event.eventType);

                return (
                  <article key={event.id} className={`cargo-event ${isProcessingEvent ? 'is-processing' : ''}`}>
                    <div className="cargo-event-rail">
                      <div className="cargo-event-marker">{String(events.length - index).padStart(2, '0')}</div>
                      {index < events.length - 1 ? (
                        <div className="cargo-event-line" />
                      ) : null}
                    </div>

                    <div className="cargo-event-content">
                      <div className="cargo-event-topline">
                        <div>
                          {isProcessingEvent ? (
                            <span className="cargo-event-category">
                              Shipment processing
                            </span>
                          ) : null}
                          <h3>{formatEventType(event.eventType)}</h3>
                          <p>{event.eventDescription}</p>
                          {event.eventLocation ? (
                            <span className="cargo-event-location">{event.eventLocation}</span>
                          ) : null}
                        </div>
                        <time>
                          {formatDateTime(event.eventTime || event.createdAt)}
                        </time>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
      </div>
    </main>
  );
}

export default ShipmentEventsPage;
