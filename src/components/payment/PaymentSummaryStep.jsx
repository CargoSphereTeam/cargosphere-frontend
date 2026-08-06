import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getShipmentPaymentSummary,
  saveShipmentPaymentSummary,
} from '../../api/paymentApi.js';
import {
  getCargoDetailsByShipmentId,
  getShipmentById,
} from '../../api/shipmentApi.js';
import { calculateShipmentPrice } from '../../utils/shipmentPricing.js';
import PaymentSummaryActions from './PaymentSummaryActions.jsx';
import PaymentSummaryCard from './PaymentSummaryCard.jsx';
import PaymentSummaryForm from './PaymentSummaryForm.jsx';

const EMPTY_FORM = {
  estimatedAmount: '0',
  baseAmount: '0',
  charges: '0',
  taxes: '0',
  discount: '0',
  paidAmount: '0',
  currency: 'INR',
  paymentMethod: '',
  remarks: '',
};

function PaymentSummaryStep({ shipmentId, onCompleted }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pricingMessage, setPricingMessage] = useState('');

  const loadPaymentSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const nextSummary = await getShipmentPaymentSummary(shipmentId);
      setSummary(nextSummary);
      if (!nextSummary) {
        const [shipment, cargoData] = await Promise.all([
          getShipmentById(shipmentId),
          getCargoDetailsByShipmentId(shipmentId),
        ]);
        const cargoDetails = Array.isArray(cargoData) ? cargoData : [];

        if (cargoDetails.length > 0) {
          setFormData(calculateShipmentPrice(shipment, cargoDetails));
          setPricingMessage(
            `Amounts calculated from ${cargoDetails.length} cargo item${cargoDetails.length === 1 ? '' : 's'} and the ${shipment.shipmentType.toLowerCase()} rate card.`,
          );
        } else {
          setFormData(EMPTY_FORM);
          setPricingMessage('Add cargo details to calculate the shipment price.');
        }
        return;
      }
      setPricingMessage('Using the saved payment summary for this shipment.');
      setFormData({
        estimatedAmount: nextSummary.estimatedAmount ?? '',
        baseAmount: nextSummary.baseAmount ?? '',
        charges: nextSummary.charges ?? '',
        taxes: nextSummary.taxes ?? '',
        discount: nextSummary.discount ?? '',
        paidAmount: nextSummary.paidAmount ?? '',
        currency: nextSummary.currency ?? '',
        paymentMethod: nextSummary.paymentMethod ?? '',
        remarks: nextSummary.remarks ?? '',
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          'Unable to load payment summary.',
      );
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadPaymentSummary();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadPaymentSummary]);

  async function submit(action) {
    try {
      setLoading(true);
      setError('');
      const response = await saveShipmentPaymentSummary(shipmentId, {
        estimatedAmount: Number(formData.estimatedAmount || 0),
        baseAmount: Number(formData.baseAmount || 0),
        charges: Number(formData.charges || 0),
        taxes: Number(formData.taxes || 0),
        discount: Number(formData.discount || 0),
        paidAmount: 0,
        currency: formData.currency.trim().toUpperCase(),
        paymentMethod: formData.paymentMethod,
        remarks: formData.remarks.trim(),
        action,
      });
      setSummary(response);

      if (action === 'APPROVE_FOR_PAYMENT') {
        toast.success('Payment details approved. Waiting for the client to pay.');
        onCompleted?.(response);
      } else {
        toast.success('Payment draft saved.');
        await loadPaymentSummary();
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          'Unable to save payment summary.',
      );
    } finally {
      setLoading(false);
    }
  }

  const toAmount = (value) => Number(value || 0);
  const finalAmount =
    toAmount(formData.baseAmount) +
    toAmount(formData.charges) +
    toAmount(formData.taxes) -
    toAmount(formData.discount);
  const balanceAmount = finalAmount - toAmount(formData.paidAmount);
  const isFormValid =
    finalAmount >= 0 &&
    balanceAmount >= 0 &&
    formData.currency.trim() !== '' &&
    formData.paymentMethod.trim() !== '';
  const canApprove = isFormValid && finalAmount > 0;

  return (
    <section aria-labelledby="payment-summary-heading">
      <div className="mb-3">
        <h2 id="payment-summary-heading" className="h4 mb-1">
          Payment Confirmation
        </h2>
        <p className="text-secondary mb-0">
          Confirm the amount for the client. Payment remains pending until
          Razorpay verifies the client transaction.
        </p>
      </div>
      <PaymentSummaryCard summary={summary} loading={loading} error={error} />
      <PaymentSummaryForm
        formData={formData}
        setFormData={setFormData}
        finalAmount={finalAmount}
        balanceAmount={balanceAmount}
      />
      {pricingMessage ? (
        <div className="alert alert-info mt-3 mb-0" role="status">
          {pricingMessage} Weight and volume determine the base price; quantity,
          fragile/hazardous handling, booking charges, and 18% tax are then added.
        </div>
      ) : null}
      <PaymentSummaryActions
        onSaveDraft={() => submit('SAVE_DRAFT')}
        onApprove={() => submit('APPROVE_FOR_PAYMENT')}
        loading={loading}
        saveDisabled={!isFormValid}
        approveDisabled={!canApprove || summary?.paymentConfirmed}
      />
    </section>
  );
}

export default PaymentSummaryStep;
