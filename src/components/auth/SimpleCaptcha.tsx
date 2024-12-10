import { useState, useEffect } from 'react';

interface SimpleCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export function SimpleCaptcha({ onValidate }: SimpleCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Générer deux nombres aléatoires entre 1 et 10
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    if (value === '') {
      setError(false);
      onValidate(false);
      return;
    }

    const isValid = parseInt(value) === (num1 + num2);
    setError(!isValid);
    onValidate(isValid);
  };

  return (
    <div>
      <label className="block text-gray-300 text-sm mb-1">
        Vérification humaine *
      </label>
      <div className="flex items-center gap-2">
        <span className="text-gray-300">Combien fait {num1} + {num2} = </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer}
          onChange={handleChange}
          className="w-20 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="?"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">La réponse est incorrecte</p>
      )}
    </div>
  );
}