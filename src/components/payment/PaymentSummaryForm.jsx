function PaymentSummaryForm({
  formData,
  setFormData,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedValue =
      name === 'currency'
        ? value.toUpperCase()
        : value;

    setFormData((currentData) => ({
      ...currentData,
      [name]: updatedValue,
    }));
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-body">
        <h2 className="h5 mb-0">
          Payment Details
        </h2>
      </div>

      <div className="card-body">
        <form>
          <div className="row g-3">

            <div className="col-md-6">
              <label
                htmlFor="estimatedAmount"
                className="form-label"
              >
                Estimated Amount
              </label>

              <input
                id="estimatedAmount"
                name="estimatedAmount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.estimatedAmount}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="baseAmount"
                className="form-label"
              >
                Base Amount
              </label>

              <input
                id="baseAmount"
                name="baseAmount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.baseAmount}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="charges"
                className="form-label"
              >
                Charges
              </label>

              <input
                id="charges"
                name="charges"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.charges}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="taxes"
                className="form-label"
              >
                Taxes
              </label>

              <input
                id="taxes"
                name="taxes"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.taxes}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="discount"
                className="form-label"
              >
                Discount
              </label>

              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="paidAmount"
                className="form-label"
              >
                Paid Amount
              </label>

              <input
                id="paidAmount"
                name="paidAmount"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={formData.paidAmount}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="currency"
                className="form-label"
              >
                Currency
              </label>

              <input
                id="currency"
                name="currency"
                type="text"
                maxLength="3"
                className="form-control"
                placeholder="INR"
                value={formData.currency}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="paymentMethod"
                className="form-label"
              >
                Payment Method
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">
                  Select Payment Method
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>

                <option value="CREDIT_CARD">
                  Credit Card
                </option>

                <option value="DEBIT_CARD">
                  Debit Card
                </option>

                <option value="CASH">
                  Cash
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            <div className="col-12">
              <label
                htmlFor="remarks"
                className="form-label"
              >
                Remarks
              </label>

              <textarea
                id="remarks"
                name="remarks"
                rows="3"
                maxLength="500"
                className="form-control"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentSummaryForm;