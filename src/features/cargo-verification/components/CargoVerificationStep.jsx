import { useState } from 'react';
import toast from 'react-hot-toast';
import { saveCargoVerification } from '../api/cargoVerificationApi.js';
import useCargoVerification from '../hooks/useCargoVerification.js';
import { getApiErrorMessage } from '../utils/cargoUtils.js';

const CARGO_TYPES = [
  'GENERAL',
  'FRAGILE',
  'HAZARDOUS',
  'PERISHABLE',
  'LIQUID',
  'HEAVY',
  'ELECTRONICS',
  'OTHER',
];

function toVerificationItem(cargo) {
  return {
    cargoDetailId: cargo.id,
    confirmedCargoName: cargo.cargoName ?? '',
    confirmedCargoDescription: cargo.cargoDescription ?? '',
    confirmedCargoType: cargo.cargoType ?? 'GENERAL',
    confirmedWeightKg: cargo.weightKg ?? '',
    confirmedVolumeCbm: cargo.volumeCbm ?? '',
    confirmedQuantity: cargo.quantity ?? 1,
    confirmedFragile: Boolean(cargo.fragile),
    confirmedHazardous: Boolean(cargo.hazardous),
    verificationRemarks: '',
  };
}

function CargoVerificationStep({ shipmentId, onCompleted }) {
  const { cargoDetails, error: loadError, loading, loadCargoDetails } =
    useCargoVerification(shipmentId);
  const [editsByCargoId, setEditsByCargoId] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = cargoDetails.map((cargo) => ({
    ...toVerificationItem(cargo),
    ...(editsByCargoId[cargo.id] ?? {}),
  }));

  function updateItem(index, field, value) {
    const cargoDetailId = items[index].cargoDetailId;

    setEditsByCargoId((currentEdits) => ({
      ...currentEdits,
      [cargoDetailId]: {
        ...(currentEdits[cargoDetailId] ?? {}),
        [field]: value,
      },
    }));
  }

  async function submit(action) {
    if (submitting || items.length === 0) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await saveCargoVerification(shipmentId, {
        action,
        items: items.map((item) => ({
          ...item,
          confirmedWeightKg: Number(item.confirmedWeightKg),
          confirmedVolumeCbm: Number(item.confirmedVolumeCbm),
          confirmedQuantity: Number(item.confirmedQuantity),
          confirmedCargoDescription:
            item.confirmedCargoDescription.trim() || null,
          verificationRemarks:
            item.verificationRemarks.trim() || null,
        })),
      });

      toast.success(
        action === 'CONFIRM_AND_CONTINUE'
          ? 'Cargo verified and shipment advanced.'
          : 'Cargo verification draft saved.',
      );
      onCompleted?.(response);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to save cargo verification.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1">Cargo Verification</h2>
            <p className="text-secondary mb-0">
              Review, correct, and confirm every cargo item.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadCargoDetails}
            disabled={loading || submitting}
          >
            Refresh
          </button>
        </div>

        {(loadError || error) && (
          <div className="alert alert-danger">{loadError || error}</div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />
          </div>
        ) : items.length === 0 ? (
          <div className="alert alert-warning mb-0">
            No cargo items are available to verify.
          </div>
        ) : (
          <div className="vstack gap-3">
            {items.map((item, index) => (
              <article className="border rounded p-3" key={item.cargoDetailId}>
                <h3 className="h6 mb-3">Cargo item {index + 1}</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Cargo name</label>
                    <input className="form-control" maxLength="100" value={item.confirmedCargoName} onChange={(event) => updateItem(index, 'confirmedCargoName', event.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cargo type</label>
                    <select className="form-select" value={item.confirmedCargoType} onChange={(event) => updateItem(index, 'confirmedCargoType', event.target.value)}>
                      {CARGO_TYPES.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Weight (kg)</label>
                    <input className="form-control" type="number" min="0.001" step="0.001" value={item.confirmedWeightKg} onChange={(event) => updateItem(index, 'confirmedWeightKg', event.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Volume (CBM)</label>
                    <input className="form-control" type="number" min="0.001" step="0.001" value={item.confirmedVolumeCbm} onChange={(event) => updateItem(index, 'confirmedVolumeCbm', event.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Quantity</label>
                    <input className="form-control" type="number" min="1" step="1" value={item.confirmedQuantity} onChange={(event) => updateItem(index, 'confirmedQuantity', event.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="2" maxLength="255" value={item.confirmedCargoDescription} onChange={(event) => updateItem(index, 'confirmedCargoDescription', event.target.value)} />
                  </div>
                  <div className="col-md-6 form-check ms-2">
                    <input className="form-check-input" type="checkbox" checked={item.confirmedFragile} onChange={(event) => updateItem(index, 'confirmedFragile', event.target.checked)} id={`fragile-${item.cargoDetailId}`} />
                    <label className="form-check-label" htmlFor={`fragile-${item.cargoDetailId}`}>Fragile</label>
                  </div>
                  <div className="col-md-5 form-check ms-2">
                    <input className="form-check-input" type="checkbox" checked={item.confirmedHazardous} onChange={(event) => updateItem(index, 'confirmedHazardous', event.target.checked)} id={`hazardous-${item.cargoDetailId}`} />
                    <label className="form-check-label" htmlFor={`hazardous-${item.cargoDetailId}`}>Hazardous</label>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Verification remarks</label>
                    <textarea className="form-control" rows="2" maxLength="500" value={item.verificationRemarks} onChange={(event) => updateItem(index, 'verificationRemarks', event.target.value)} />
                  </div>
                </div>
              </article>
            ))}

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" disabled={submitting} onClick={() => submit('SAVE_DRAFT')}>Save Draft</button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => submit('CONFIRM_AND_CONTINUE')}>{submitting ? 'Saving...' : 'Confirm & Continue'}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CargoVerificationStep;
