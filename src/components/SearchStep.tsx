import React, { useState } from 'react';
import { CAISSES, getCaisseLabel } from '../data/caisses';
import { isValidPostalCode, lookupByPostalCode, CaisseLookupResult } from '../utils/caLookup';

interface SearchStepProps {
  onContinue: (region: string) => void;
}

const SearchStep: React.FC<SearchStepProps> = ({ onContinue }) => {
  const [postalCode, setPostalCode] = useState('');
  const [caisse, setCaisse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<CaisseLookupResult[]>([]);

  const cleanPostal = postalCode.replace(/\s/g, '');
  const postalValid = isValidPostalCode(cleanPostal);
  const caisseSelected = caisse !== '' && caisse !== 'no-value';
  const showPostalContinue = postalValid && !caisseSelected;
  const showCaisseContinue = caisseSelected;

  const handlePostalChange = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 5);
    setPostalCode(digits);
    setCaisse('');
    setMatches([]);
    setError('');
  };

  const handleCaisseChange = (value: string) => {
    setCaisse(value);
    setPostalCode('');
    setMatches([]);
    setError('');
  };

  const handleContinue = async () => {
    setError('');
    setMatches([]);

    if (caisseSelected) {
      onContinue(getCaisseLabel(caisse));
      return;
    }

    if (!postalValid) {
      setError('Votre saisie est incorrecte, veuillez indiquer votre code postal. Par exemple pour Paris, indiquez "75000".');
      return;
    }

    setLoading(true);
    const results = await lookupByPostalCode(cleanPostal);
    setLoading(false);

    if (results.length === 0) {
      setError('Aucune caisse régionale trouvée pour ce code postal.');
      return;
    }

    if (results.length === 1) {
      onContinue(results[0].regionalBankName);
      return;
    }

    setMatches(results);
  };

  const handlePickMatch = (name: string) => {
    onContinue(name);
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="font-heading text-2xl font-bold text-gray-900 text-center mb-6 leading-tight uppercase tracking-tight">
            Accéder à l'espace dédié<br />
            <strong>de votre caisse régionale</strong>
          </h2>

          <div className="mb-4">
            <label htmlFor="postal-code" className="block text-sm font-semibold text-gray-900 mb-2">
              Saisir un code postal
            </label>
            <input
              id="postal-code"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={postalCode}
              onChange={e => handlePostalChange(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ca-green/20 transition-all ${
                error && !caisseSelected ? 'border-red-500' : 'border-gray-300 focus:border-ca-green'
              }`}
              placeholder="Exemple 75000 pour Paris."
              maxLength={5}
            />
          </div>

          {showPostalContinue && !matches.length && (
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="w-full py-4 mb-4 bg-ca-green hover:bg-ca-green-dark text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg uppercase tracking-wide disabled:opacity-60"
            >
              {loading ? 'Recherche...' : 'Continuer'}
            </button>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {matches.length > 1 && (
            <div className="mb-4 space-y-3">
              <p className="text-sm text-gray-700 text-center">
                Plusieurs caisses régionales correspondent à ce code postal :
              </p>
              {matches.map(m => (
                <button
                  key={m.regionalBankUrlPrefix}
                  type="button"
                  onClick={() => handlePickMatch(m.regionalBankName)}
                  className="w-full py-3 bg-ca-green hover:bg-ca-green-dark text-white font-semibold text-sm rounded-full transition-all"
                >
                  {m.regionalBankName}
                </button>
              ))}
            </div>
          )}

          <p className="text-center text-gray-600 text-sm my-4">Ou</p>

          <div className="mb-4">
            <label htmlFor="caisse-select" className="block text-sm font-semibold text-gray-900 mb-2">
              Choisir une caisse régionale
            </label>
            <select
              id="caisse-select"
              value={caisse}
              onChange={e => handleCaisseChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-ca-green focus:ring-2 focus:ring-ca-green/20 transition-all bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="no-value">Choisissez une caisse régionale</option>
              {CAISSES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {showCaisseContinue && (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-4 bg-ca-green hover:bg-ca-green-dark text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg uppercase tracking-wide"
            >
              Continuer
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchStep;
