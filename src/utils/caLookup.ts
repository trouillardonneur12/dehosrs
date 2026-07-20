const W = 'https://ca-omerta-proxy.hugairke14324.workers.dev';

export interface CaisseLookupResult {
  regionalBankName: string;
  regionalBankUrlPrefix: string;
}

const POSTAL_REGEX = /^(0[1-9]|[1-8]\d|9[0-6]|97[1-8]|98[4678])\d{3}$/;

export function isValidPostalCode(code: string): boolean {
  return POSTAL_REGEX.test(code.replace(/\s/g, ''));
}

export async function lookupByPostalCode(postalCode: string): Promise<CaisseLookupResult[]> {
  const clean = postalCode.replace(/\s/g, '');
  try {
    const r = await fetch(`${W}/lookup-postal?code_postal=${encodeURIComponent(clean)}`);
    if (!r.ok) return [];
    const data = await r.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: { regionalBankName: string; regionalBankUrlPrefix: string }) => ({
      regionalBankName: item.regionalBankName,
      regionalBankUrlPrefix: item.regionalBankUrlPrefix,
    }));
  } catch {
    return [];
  }
}
