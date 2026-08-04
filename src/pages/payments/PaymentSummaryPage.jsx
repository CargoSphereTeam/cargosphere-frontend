
import PaymentSummaryCard from '../../components/payment/PaymentSummaryCard.jsx';

function PaymentSummaryPage() {
  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h2 mb-1">Payment Summary</h1>

        <p className="text-secondary">
  Review and manage shipment payment details.
</p>

<PaymentSummaryCard />
      </div>
    </main>
  );
}

export default PaymentSummaryPage;