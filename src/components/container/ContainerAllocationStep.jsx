import { useEffect, useMemo, useState } from 'react';
import {
  createAllocation,
  getAllocationsByShipmentId,
  getContainerTypes,
} from '../../api/containerApi.js';
import { getCargoDetailsByShipmentId } from '../../api/shipmentApi.js';

const INITIAL_FORM_DATA = {
  containerTypeId: '',
  quantity: '1',
  notes: '',
};

function getErrorMessage(requestError) {
  const responseData = requestError.response?.data;

  if (
    responseData?.validationErrors &&
    typeof responseData.validationErrors === 'object'
  ) {
    const validationMessages = Object.values(
      responseData.validationErrors,
    ).filter(Boolean);

    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  const status = requestError.response?.status;

  if (status === 400) {
    return 'The allocation details are invalid. Please check the form.';
  }

  if (status === 401) {
    return 'Your session is missing or invalid. Please sign in again.';
  }

  if (status === 403) {
    return 'Only an administrator can manage container allocations.';
  }

  if (status === 404) {
    return 'The shipment or selected container type could not be found.';
  }

  if (status === 409) {
    return 'This container type has already been allocated to the shipment.';
  }

  if (status >= 500) {
    return 'The container service is currently unavailable. Please try again later.';
  }

  return 'Unable to complete the container allocation.';
}

function formatNumber(value, decimalPlaces = 3) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '0.000';
  }

  return numericValue.toFixed(decimalPlaces);
}

function formatDateTime(value) {
  if (!value) {
    return 'Not available';
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

function ContainerAllocationStep({
  shipmentId,
  onCompleted,
  onRefresh,
}) {
  const [containerTypes, setContainerTypes] = useState([]);
  const [cargoDetails, setCargoDetails] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadAllocationData() {
      if (!shipmentId) {
        setError('Shipment ID is required for container allocation.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [
          containerTypeData,
          cargoData,
          allocationData,
        ] = await Promise.all([
          getContainerTypes(),
          getCargoDetailsByShipmentId(shipmentId),
          getAllocationsByShipmentId(shipmentId),
        ]);

        if (!isActive) {
          return;
        }

        const activeContainerTypes = Array.isArray(
          containerTypeData,
        )
          ? containerTypeData.filter(
              (containerType) =>
                containerType.active === true,
            )
          : [];

        setContainerTypes(activeContainerTypes);
        setCargoDetails(
          Array.isArray(cargoData) ? cargoData : [],
        );
        setAllocations(
          Array.isArray(allocationData)
            ? allocationData
            : [],
        );
      } catch (requestError) {
        if (isActive) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadAllocationData();

    return () => {
      isActive = false;
    };
  }, [shipmentId, reloadKey]);

  const selectedContainerType = useMemo(
    () =>
      containerTypes.find(
        (containerType) =>
          String(containerType.containerTypeId) ===
          String(formData.containerTypeId),
      ) ?? null,
    [containerTypes, formData.containerTypeId],
  );

  const totalCargoWeightKg = useMemo(
    () =>
      cargoDetails.reduce(
        (total, cargo) =>
          total + (Number(cargo.weightKg) || 0),
        0,
      ),
    [cargoDetails],
  );

  const totalCargoVolumeCbm = useMemo(
    () =>
      cargoDetails.reduce(
        (total, cargo) =>
          total + (Number(cargo.volumeCbm) || 0),
        0,
      ),
    [cargoDetails],
  );

  const requestedQuantity =
    Number(formData.quantity) || 0;

  const previewWeightCapacity =
    selectedContainerType && requestedQuantity > 0
      ? Number(selectedContainerType.maxWeightKg) *
        requestedQuantity
      : 0;

  const previewVolumeCapacity =
    selectedContainerType && requestedQuantity > 0
      ? Number(selectedContainerType.maxVolumeCbm) *
        requestedQuantity
      : 0;

  const previewWeightRemaining =
    previewWeightCapacity - totalCargoWeightKg;

  const previewVolumeRemaining =
    previewVolumeCapacity - totalCargoVolumeCbm;

  const weightPreviewPasses =
    previewWeightCapacity >= totalCargoWeightKg;

  const volumePreviewPasses =
    previewVolumeCapacity >= totalCargoVolumeCbm;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const refreshAllocations = async () => {
    const updatedAllocations =
      await getAllocationsByShipmentId(shipmentId);

    const normalizedAllocations = Array.isArray(
      updatedAllocations,
    )
      ? updatedAllocations
      : [];

    setAllocations(normalizedAllocations);

    if (typeof onRefresh === 'function') {
      onRefresh(normalizedAllocations);
    }

    return normalizedAllocations;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError('');
    setSuccessMessage('');

    if (!shipmentId) {
      setError('Shipment ID is required.');
      return;
    }

    if (!formData.containerTypeId) {
      setError('Select a container type.');
      return;
    }

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      setError(
        'Allocation quantity must be a whole number of at least 1.',
      );
      return;
    }

    if (formData.notes.trim().length > 255) {
      setError('Allocation notes must not exceed 255 characters.');
      return;
    }

    const allocationData = {
      shipmentId: Number(shipmentId),
      containerTypeId: Number(
        formData.containerTypeId,
      ),
      quantity: requestedQuantity,
      allocationStatus: 'ALLOCATED',
      notes: formData.notes.trim() || null,
    };

    try {
      setSubmitting(true);

      const createdAllocation =
        await createAllocation(allocationData);

      await refreshAllocations();

      setFormData(INITIAL_FORM_DATA);
      setSuccessMessage(
        `${createdAllocation.containerTypeName} allocated successfully.`,
      );

      if (typeof onCompleted === 'function') {
        onCompleted(createdAllocation);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading container allocation data...
            </span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading container allocation data...
          </p>
        </div>
      </div>
    );
  }

  if (error && containerTypes.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        <h2 className="h5 alert-heading">
          Unable to load container allocation
        </h2>

        <p>{error}</p>

        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() =>
            setReloadKey((currentKey) => currentKey + 1)
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="container-allocation-heading">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-4">
        <div>
          <h2
            id="container-allocation-heading"
            className="h4 mb-1"
          >
            Container Allocation
          </h2>

          <p className="text-secondary mb-0">
            Allocate container capacity to shipment #{shipmentId}.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary align-self-md-start"
          onClick={() =>
            setReloadKey((currentKey) => currentKey + 1)
          }
          disabled={submitting}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="status">
          {successMessage}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-body">
              <h3 className="h5 mb-0">
                Original Cargo Summary
              </h3>
            </div>

            <div className="card-body">
              {cargoDetails.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  No cargo details are currently available for this
                  shipment.
                </div>
              ) : (
                <>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6">
                      <p className="text-secondary small mb-1">
                        Total Cargo Weight
                      </p>

                      <p className="h5 mb-0">
                        {formatNumber(totalCargoWeightKg)} kg
                      </p>
                    </div>

                    <div className="col-12 col-sm-6">
                      <p className="text-secondary small mb-1">
                        Total Cargo Volume
                      </p>

                      <p className="h5 mb-0">
                        {formatNumber(totalCargoVolumeCbm)} CBM
                      </p>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Cargo</th>
                          <th>Weight</th>
                          <th>Volume</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cargoDetails.map((cargo) => (
                          <tr key={cargo.id}>
                            <td>
                              <div className="fw-semibold">
                                {cargo.cargoName}
                              </div>

                              <div className="text-secondary small">
                                {cargo.cargoType ??
                                  'Not specified'}
                              </div>
                            </td>

                            <td>
                              {formatNumber(cargo.weightKg)} kg
                            </td>

                            <td>
                              {cargo.volumeCbm == null
                                ? 'Not specified'
                                : `${formatNumber(
                                    cargo.volumeCbm,
                                  )} CBM`}
                            </td>

                            <td>
                              {cargo.quantity ??
                                'Not specified'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-body">
              <h3 className="h5 mb-0">
                Existing Allocations
              </h3>
            </div>

            {allocations.length === 0 ? (
              <div className="card-body text-center py-4">
                <p className="text-secondary mb-0">
                  No containers have been allocated to this shipment.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Container Type</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Allocated At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation.allocationId}>
                        <td>
                          <div className="fw-semibold">
                            {allocation.containerTypeName}
                          </div>

                          <div className="text-secondary small">
                            {allocation.containerTypeCode}
                          </div>
                        </td>

                        <td>{allocation.quantity}</td>

                        <td>
                          <span className="badge text-bg-success">
                            {allocation.allocationStatus}
                          </span>
                        </td>

                        <td>
                          {formatDateTime(
                            allocation.allocatedAt,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card shadow-sm">
            <div className="card-header bg-body">
              <h3 className="h5 mb-0">
                Allocate Container
              </h3>
            </div>

            <div className="card-body">
              {containerTypes.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  No active container types are available.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="containerTypeId"
                      className="form-label"
                    >
                      Container Type
                    </label>

                    <select
                      id="containerTypeId"
                      name="containerTypeId"
                      className="form-select"
                      value={formData.containerTypeId}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    >
                      <option value="">
                        Select a container type
                      </option>

                      {containerTypes.map((containerType) => (
                        <option
                          key={containerType.containerTypeId}
                          value={
                            containerType.containerTypeId
                          }
                        >
                          {containerType.typeName} (
                          {containerType.typeCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="quantity"
                      className="form-label"
                    >
                      Quantity
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      step="1"
                      className="form-control"
                      value={formData.quantity}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="notes"
                      className="form-label"
                    >
                      Notes
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      maxLength="255"
                      className="form-control"
                      value={formData.notes}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Optional allocation notes"
                    />

                    <div className="form-text">
                      {formData.notes.length}/255 characters
                    </div>
                  </div>

                  {selectedContainerType && (
                    <div className="border rounded p-3 mb-3">
                      <h4 className="h6">
                        Capacity Preview
                      </h4>

                      <dl className="row mb-0 small">
                        <dt className="col-7">
                          Allocated weight capacity
                        </dt>

                        <dd className="col-5 text-end">
                          {formatNumber(
                            previewWeightCapacity,
                          )}{' '}
                          kg
                        </dd>

                        <dt className="col-7">
                          Cargo weight
                        </dt>

                        <dd className="col-5 text-end">
                          {formatNumber(
                            totalCargoWeightKg,
                          )}{' '}
                          kg
                        </dd>

                        <dt className="col-7">
                          Weight remaining
                        </dt>

                        <dd
                          className={`col-5 text-end ${
                            weightPreviewPasses
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          {formatNumber(
                            previewWeightRemaining,
                          )}{' '}
                          kg
                        </dd>

                        <dt className="col-7">
                          Allocated volume capacity
                        </dt>

                        <dd className="col-5 text-end">
                          {formatNumber(
                            previewVolumeCapacity,
                          )}{' '}
                          CBM
                        </dd>

                        <dt className="col-7">
                          Cargo volume
                        </dt>

                        <dd className="col-5 text-end">
                          {formatNumber(
                            totalCargoVolumeCbm,
                          )}{' '}
                          CBM
                        </dd>

                        <dt className="col-7">
                          Volume remaining
                        </dt>

                        <dd
                          className={`col-5 text-end ${
                            volumePreviewPasses
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                        >
                          {formatNumber(
                            previewVolumeRemaining,
                          )}{' '}
                          CBM
                        </dd>
                      </dl>

                      <div
                        className={`alert mt-3 mb-0 ${
                          weightPreviewPasses &&
                          volumePreviewPasses
                            ? 'alert-info'
                            : 'alert-warning'
                        }`}
                      >
                        This is a frontend preview only. The
                        current backend does not validate cargo
                        capacity during allocation.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={
                      submitting ||
                      !formData.containerTypeId
                    }
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Allocating...
                      </>
                    ) : (
                      'Allocate Container'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContainerAllocationStep;