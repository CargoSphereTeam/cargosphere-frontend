import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
const [loading, setLoading] = useState(Boolean(shipmentId));
const [error, setError] = useState('');

const isFormValid =
  formData.estimatedAmount !== '' &&
  formData.baseAmount !== '' &&
  formData.currency.trim() !== '' &&
  formData.paymentMethod.trim() !== '';


  const loadPaymentSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const paymentSummary =
        await getShipmentPaymentSummary(shipmentId);

      setSummary(paymentSummary);

      if (!paymentSummary) return;

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
  }, [shipmentId]);

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
    toast.success('Payment draft saved.');
  } catch (requestError) {
    const errorMessage =
      requestError.response?.data?.message ??
      'Unable to save payment summary.';

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

const handleApprove = async () => {
  try {
    setLoading(true);
    setError('');

    await saveShipmentPaymentSummary(
      shipmentId,
      {
        ...formData,
        paidAmount: 0,
        action: 'APPROVE_FOR_PAYMENT',
      },
    );

    await loadPaymentSummary();
    toast.success('Payment details approved. Waiting for client payment.');
  } catch (requestError) {
    const errorMessage =
      requestError.response?.data?.message ??
      'Unable to approve payment details.';

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!shipmentId) return undefined;
    const timerId = window.setTimeout(() => void loadPaymentSummary(), 0);
    return () => window.clearTimeout(timerId);
  }, [loadPaymentSummary, shipmentId]);

  const toAmount = (value) => Number(value || 0);
  const finalAmount =
    toAmount(formData.baseAmount) +
    toAmount(formData.charges) +
    toAmount(formData.taxes) -
    toAmount(formData.discount);
  const balanceAmount = finalAmount - toAmount(formData.paidAmount);
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
  finalAmount={finalAmount}
  balanceAmount={balanceAmount}
/>

      <PaymentSummaryActions
  onSaveDraft={handleSaveDraft}
  onApprove={handleApprove}
  loading={loading}
  saveDisabled={!isFormValid}
  approveDisabled={!isFormValid || finalAmount <= 0 || summary?.paymentConfirmed}
/>
    </main>
  );
}

export default PaymentSummaryPage;
