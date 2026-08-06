const PROCESSING_STAGES = [
  'PENDING_ADMIN_REVIEW',
  'CONTAINER_ALLOCATION',
  'CARGO_VERIFICATION',
  'DOCUMENT_VERIFICATION',
  'PAYMENT_CONFIRMATION',
  'READY_FOR_EBILL',
  'EBILL_GENERATED',
];

function formatProcessingStage(stage) {
  if (!stage) {
    return 'Not started';
  }

  return stage
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export {
  PROCESSING_STAGES,
  formatProcessingStage,
};
