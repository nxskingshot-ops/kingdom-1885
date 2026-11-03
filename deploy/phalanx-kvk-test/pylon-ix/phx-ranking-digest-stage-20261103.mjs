/** Stable SHA-256 digest of a ranking board, independent of JSON key insertion order. */
function canonical(value) {
 if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
 if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
 return JSON.stringify(value);
}
export async function digestRankingRows(rows, cryptoImpl = globalThis.crypto) {
 if (!Array.isArray(rows)) throw new TypeError('Ranking rows must be an array');
 if (!cryptoImpl?.subtle?.digest) throw new Error('WebCrypto SHA-256 unavailable');
 const bytes = new TextEncoder().encode(canonical(rows));
 const digest = await cryptoImpl.subtle.digest('SHA-256', bytes);
 return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
export async function prepareSnapshot(board, payload, validation, cryptoImpl = globalThis.crypto) {
 if (validation?.status !== 'VERIFIED') return { board, status: validation?.status || 'ERROR', contentHash: null };
 return { board, status: 'VERIFIED', capturedAt: validation.capturedAt, contentHash: await digestRankingRows(payload.rows, cryptoImpl), entries: payload.rows, entryCount: payload.rows.length };
}
