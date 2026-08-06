import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentSummaryCard from '../../components/payment/PaymentSummaryCard.jsx';
import PaymentSummaryForm from '../../components/payment/PaymentSummaryForm.jsx';
import PaymentSummaryActions from '../../components/payment/PaymentSummaryActions.jsx';
import {
  getShipmentPaymentSummary,
  saveShipmentPaymentSummary,
} from '../../api/paymentApi.js';

function PaymentSummaryPage() {
  const { shipmentId } = useParams();

  const [formData, setFormData] = useState({
  estimatedAmount: '',
  baseAmount: '',
  charges: '',
  taxes: '',
  discount: '',
  paidAmount: '',
  currency: '',
  paymentMethod: '',
  remarks: '',
});

const [summary, setSummary] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const isFormValid =
  formData.estimatedAmount !== '' &&
  formData.baseAmount !== '' &&
  formData.currency.trim() !== '' &&
  formData.paymentMethod.trim() !== '';


   const loadPaymentSummary = async () => {
    try {
      setLoading(true);
      setError('');

      const paymentSummary =
        await getShipmentPaymentSummary(shipmentId);

      setSummary(paymentSummary);

      setFormData({
        estimatedAmount: paymentSummary.estimatedAmount ?? '',
        baseAmount: paymentSummary.baseAmount ?? '',
        charges: paymentSummary.charges ?? '',
        taxes: paymentSummary.taxes ?? '',
        discount: paymentSummary.discount ?? '',
        paidAmount: paymentSummary.paidAmount ?? '',
        currency: paymentSummary.currency ?? '',
        paymentMethod: paymentSummary.paymentMethod ?? '',
        remarks: paymentSummary.remarks ?? '',
      });
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.message ??
        'Unable to load payment summary.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
  try {
    setLoading(true);
    setError('');

    await saveShipmentPaymentSummary(
      shipmentId,
      {
        ...formData,
        action: 'SAVE_DRAFT',
      },
    );

    await loadPaymentSummary();
  } catch (requestError) {
    const errorMessage =
      requestError.response?.data?.message ??
      'Unable to save payment summary.';

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

const handleConfirm = async () => {
  try {
    setLoading(true);
    setError('');

    await saveShipmentPaymentSummary(
      shipmentId,
      {
        ...formData,
        action: 'CONFIRM_AND_CONTINUE',
      },
    );

    await loadPaymentSummary();
  } catch (requestError) {
    const errorMessage =
      requestError.response?.data?.message ??
      'Unable to confirm payment summary.';

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (!shipmentId) {
    setLoading(false);
    return;
  }

 

  loadPaymentSummary();
}, [shipmentId]);
  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h2 mb-1">
          Payment Summary
        </h1>

        <p className="text-secondary">
          Review and manage shipment payment details.
        </p>
      </div>

      <PaymentSummaryCard
  summary={summary}
  loading={loading}
  error={error}
/>

      <PaymentSummaryForm
  formData={formData}
  setFormData={setFormData}
/>

      <PaymentSummaryActions
  onSaveDraft={handleSaveDraft}
  onConfirm={handleConfirm}
  loading={loading}
  disabled={!isFormValid}
/>
    </main>
  );
}

export default PaymentSummaryPage;