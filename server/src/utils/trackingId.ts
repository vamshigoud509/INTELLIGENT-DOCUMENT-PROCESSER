/**
 * Generates a memorable, unique tracking identifier formatted as:
 * CIVIC-YYYYMMDD-XXXX
 * Example: CIVIC-20260929-8472
 */
export function generateTrackingId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // 4 random alphanumeric characters (digits and uppercase letters, avoiding ambiguous chars)
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }

  return `CIVIC-${year}${month}${day}-${randomPart}`;
}
