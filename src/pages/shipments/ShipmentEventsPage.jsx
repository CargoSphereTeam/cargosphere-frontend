import { Link } from 'react-router-dom';

const SAMPLE_EVENTS = [
  {
    id: 4,
    eventType: 'DELIVERED',
    eventDescription: 'Shipment delivered successfully',
    eventLocation: 'Hyderabad',
    eventTime: '2026-07-21T10:20:30Z',
  },
  {
    id: 3,
    eventType: 'IN_TRANSIT',
    eventDescription: 'Shipment status updated to IN_TRANSIT',
    eventLocation: null,
    eventTime: '2026-07-21T10:14:26Z',
  },
  {
    id: 2,
    eventType: 'BOOKED',
    eventDescription: 'Shipment status updated to BOOKED',
    eventLocation: null,
    eventTime: '2026-07-21T10:04:28Z',
  },
  {
    id: 1,
    eventType: 'CREATED',
    eventDescription: 'Shipment created',
    eventLocation: 'Delhi',
    eventTime: '2026-07-21T10:02:52Z',
  },
];

function formatEventType(eventType) {
  return eventType.replaceAll('_', ' ');
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ShipmentEventsPage() {

  return (
    <main className="container py-4">
      <div className="mb-4">
        <Link
          to=".."
          relative="path"
          className="btn btn-link p-0 mb-2 text-decoration-none"
        >
          ← Back to Shipment Details
        </Link>

        <h1 className="h2 mb-1">Shipment Event History</h1>

        <p className="text-secondary">
          CS-20260721-31B016FE
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-body">
          <h2 className="h5 mb-0">Timeline</h2>
        </div>

        <div className="card-body">
          <div className="d-flex flex-column gap-4">
            {SAMPLE_EVENTS.map((event, index) => (
              <div
                key={event.id}
                className="d-flex gap-3"
              >
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="rounded-circle bg-primary"
                    style={{
                      width: '14px',
                      height: '14px',
                      marginTop: '6px',
                    }}
                  />

                  {index < SAMPLE_EVENTS.length - 1 && (
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
                        {event.eventDescription}
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
      </div>
    </main>
  );
}

export default ShipmentEventsPage;
