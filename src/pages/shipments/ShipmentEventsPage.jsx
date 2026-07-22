import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getShipmentById,
  getShipmentEventsByShipmentId,
} from '../../api/shipmentApi.js';

function formatEventType(eventType) {
  if (!eventType) {
    return 'UNKNOWN EVENT';
  }

  return eventType.replaceAll('_', ' ');
}

function formatDateTime(value) {
  if (!value) {
    return 'Time not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function ShipmentEventsPage() {
  const { shipmentId } = useParams();

  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadEventHistory() {
      try {
        setLoading(true);
        setError('');

        const [shipmentData, eventData] = await Promise.all([
          getShipmentById(shipmentId),
          getShipmentEventsByShipmentId(shipmentId),
        ]);

        if (isActive) {
          setShipment(shipmentData);
          setEvents(Array.isArray(eventData) ? eventData : []);
        }
      } catch (requestError) {
        if (isActive) {
          const errorMessage =
            requestError.response?.data?.message ??
            'Unable to load shipment event history. Please try again.';

          setError(errorMessage);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadEventHistory();

    return () => {
      isActive = false;
    };
  }, [shipmentId]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (firstEvent, secondEvent) =>
          new Date(secondEvent.eventTime).getTime() -
          new Date(firstEvent.eventTime).getTime(),
      ),
    [events],
  );

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading shipment event history...
          </span>
        </div>

        <p className="text-secondary mt-3 mb-0">
          Loading shipment event history...
        </p>
      </main>
    );
  }

  if (error || !shipment) {
    return (
      <main className="container py-4">
        <Link
          to={`/shipments/${shipmentId}`}
          className="btn btn-link p-0 mb-3 text-decoration-none"
        >
          ← Back to Shipment Details
        </Link>

        <div className="alert alert-danger" role="alert">
          {error || 'Shipment event history is unavailable.'}
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="mb-4">
        <Link
          to={`/shipments/${shipmentId}`}
          className="btn btn-link p-0 mb-2 text-decoration-none"
        >
          ← Back to Shipment Details
        </Link>

        <h1 className="h2 mb-1">Shipment Event History</h1>

        <p className="text-secondary mb-0">
          {shipment.shipmentNumber}
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-body">
          <h2 className="h5 mb-0">Timeline</h2>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="card-body text-center py-5">
            <h3 className="h5">No shipment events found</h3>

            <p className="text-secondary mb-0">
              Shipment activity will appear here when events are recorded.
            </p>
          </div>
        ) : (
          <div className="card-body">
            <div className="d-flex flex-column gap-4">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="d-flex gap-3">
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="rounded-circle bg-primary"
                      style={{
                        width: '14px',
                        height: '14px',
                        marginTop: '6px',
                      }}
                    />

                    {index < sortedEvents.length - 1 && (
                      <div
                        className="border-start flex-grow-1 mt-2"
                        style={{ minHeight: '70px' }}
                      />
                    )}
                  </div>

                  <div className="flex-grow-1 pb-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                      <div>
                        <h3 className="h6 mb-1">
                          {formatEventType(event.eventType)}
                        </h3>

                        <p className="mb-1">
                          {event.eventDescription ||
                            'No event description available.'}
                        </p>

                        {event.eventLocation && (
                          <p className="text-secondary small mb-0">
                            Location: {event.eventLocation}
                          </p>
                        )}
                      </div>

                      <time className="text-secondary small">
                        {formatDateTime(event.eventTime)}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ShipmentEventsPage;