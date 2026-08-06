import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createRazorpayOrder,
  getRazorpayPaymentStatus,
  verifyRazorpayPayment,
} from '../../api/paymentApi.js';

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadCheckoutScript() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

function RazorpayCheckoutButton({ shipmentId, disabled, onPaid }) {
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const summary = await getRazorpayPaymentStatus(shipmentId);
        if (active) setPaid(Boolean(summary?.paymentConfirmed));
      } catch {
        if (active) setPaid(false);
      } finally {
        if (active) setCheckingStatus(false);
      }
    }

    void loadStatus();
    return () => {
      active = false;
    };
  }, [shipmentId]);

  async function handlePayment() {
    try {
      setProcessing(true);
      await loadCheckoutScript();
      const order = await createRazorpayOrder(shipmentId);

      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'CargoSphere',
        description: order.description,
        theme: { color: '#1f6b4c' },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        handler: async (response) => {
          try {
            const summary = await verifyRazorpayPayment(shipmentId, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setPaid(true);
            toast.success('Payment completed and verified successfully.');
            onPaid?.(summary);
          } catch (requestError) {
            toast.error(
              requestError.response?.data?.message ??
                'Payment completed, but server verification failed.',
            );
          } finally {
            setProcessing(false);
          }
        },
      });

      checkout.on('payment.failed', (response) => {
        setProcessing(false);
        toast.error(response.error?.description ?? 'Payment failed. Please try again.');
      });
      checkout.open();
    } catch (requestError) {
      setProcessing(false);
      toast.error(
        requestError.response?.data?.message ??
          requestError.message ??
          'Unable to start payment.',
      );
    }
  }

  if (paid) {
    return (
      <div className="alert alert-success mt-4 mb-0" role="status">
        <strong>Payment completed</strong>
        <div className="small mt-1">Your payment was received and verified successfully.</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`btn w-100 mt-4 ${paid ? 'btn-success' : 'btn-primary'}`}
      disabled={disabled || processing || checkingStatus}
      onClick={handlePayment}
    >
      {checkingStatus
        ? 'Checking payment status...'
        : processing
          ? 'Opening secure checkout...'
          : 'Pay securely with Razorpay'}
    </button>
  );
}

export default RazorpayCheckoutButton;
