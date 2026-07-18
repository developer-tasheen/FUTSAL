export function createBookingReference() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NFC-${year}-${random}`;
}
