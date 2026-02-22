export interface ShareData {
  companyName: string;
  endingType: string;
  endingEmoji: string;
  endingLabel: string;
  endingLine: string;
  valuation: number;
  weekLog: string;
  dims: { company: number; relationships: number; energy: number; integrity: number };
  headline: string;
  rank: number;
}

/**
 * Encode game result data into a compact URL-safe base64 string.
 */
export function encodeResult(data: ShareData): string {
  const json = JSON.stringify(data);
  const encoded = btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a URL-safe base64 string back into ShareData.
 */
export function decodeResult(encoded: string): ShareData | null {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const decoded = atob(b64);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const data = JSON.parse(json) as ShareData;
    if (!data.companyName || !data.endingType || typeof data.valuation !== 'number') {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Build a full share URL from game result data.
 */
export function buildShareUrl(data: ShareData): string {
  return `https://behindtheroom.com/r/${encodeResult(data)}`;
}
