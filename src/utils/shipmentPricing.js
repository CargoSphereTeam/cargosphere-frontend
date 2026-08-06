const RATE_CARD = {
  ROAD: { weightPerKg: 12, volumePerCbm: 600 },
  RAIL: { weightPerKg: 9, volumePerCbm: 450 },
  SEA: { weightPerKg: 7, volumePerCbm: 350 },
  AIR: { weightPerKg: 35, volumePerCbm: 1200 },
};

const BOOKING_CHARGE = 250;
const PER_UNIT_HANDLING_CHARGE = 50;
const TAX_RATE = 0.18;

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateShipmentPrice(shipment, cargoDetails) {
  const rate = RATE_CARD[shipment.shipmentType] ?? RATE_CARD.ROAD;
  let baseAmount = 0;
  let handlingCharges = 0;

  cargoDetails.forEach((cargo) => {
    const weightPrice = (Number(cargo.weightKg) || 0) * rate.weightPerKg;
    const volumePrice = (Number(cargo.volumeCbm) || 0) * rate.volumePerCbm;
    const cargoBase = Math.max(weightPrice, volumePrice);
    const quantityCharge = (Number(cargo.quantity) || 1) * PER_UNIT_HANDLING_CHARGE;
    const specialHandlingRate =
      (cargo.fragile ? 0.1 : 0) + (cargo.hazardous ? 0.2 : 0);

    baseAmount += cargoBase;
    handlingCharges += quantityCharge + cargoBase * specialHandlingRate;
  });

  const charges = handlingCharges + BOOKING_CHARGE;
  const taxes = (baseAmount + charges) * TAX_RATE;
  const finalAmount = baseAmount + charges + taxes;

  return {
    estimatedAmount: roundCurrency(finalAmount),
    baseAmount: roundCurrency(baseAmount),
    charges: roundCurrency(charges),
    taxes: roundCurrency(taxes),
    discount: 0,
    paidAmount: roundCurrency(finalAmount),
    currency: 'INR',
    paymentMethod: '',
    remarks: '',
  };
}

export { RATE_CARD, calculateShipmentPrice };
