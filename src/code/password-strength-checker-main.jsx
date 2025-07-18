const code = `import React, { useState, useEffect, useMemo } from 'react';

const PasswordStrengthCheckerMain = () => {
  const [password, setPassword] = useState('');
  const [strengthScore, setStrengthScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('Type your password to check its strength.');

  const logoUrl = "https://i.ibb.co/qLgM2cfL/image.png";

  // Custom Tailwind classes for colors
  const borderColor1 = '#FFB800';
  const borderColor2 = '#027BE5';
  const gameContentBg = '#F4F6FA';
  const gameContentBorder = '#B4B9CF';
  const alertBorderIconColor = '#F4364B';
  const alertBackground = '#FFE9E9';

  // Password strength evaluation logic
  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    let messages = [];

    // Length check
    if (pwd.length < 6) {
      messages.push('Password is too short (min 6 characters).');
      score += pwd.length * 5; // Give some points for length even if short
    } else if (pwd.length >= 6 && pwd.length <= 8) {
      score += 20;
      messages.push('Make it longer for better security.');
    } else if (pwd.length > 8) {
      score += 40;
    }

    // Character types
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\\-=\\[\\]{};':"\\|,.<>/?]/g.test(pwd);

    let charTypeCount = 0;
    if (hasLowercase) { score += 10; charTypeCount++; }
    if (hasUppercase) { score += 10; charTypeCount++; }
    if (hasNumber) { score += 10; charTypeCount++; }
    if (hasSymbol) { score += 10; charTypeCount++; }

    if (!hasLowercase) messages.push('Add lowercase letters.');
    if (!hasUppercase) messages.push('Add uppercase letters.');
    if (!hasNumber) messages.push('Add numbers.');
    if (!hasSymbol) messages.push('Add symbols.');

    // Deduct for common patterns/words (simplified)
    const commonPatterns = ['password', '123456', 'qwerty', 'admin'];
    const isCommon = commonPatterns.some(pattern => pwd.toLowerCase().includes(pattern));
    if (isCommon) {
      score = Math.max(0, score - 20); // Deduct significant points
      messages.push('Avoid common words or patterns.');
    }

    // Cap score at 100
    score = Math.min(100, score);
    score = Math.max(0, score); // Ensure score doesn't go negative

    // Generate feedback message
    let finalMessage = '';
    if (pwd.length === 0) {
      finalMessage = 'Type your password to check its strength.';
    } else if (score < 20) {
      finalMessage = 'Very Weak: ' + (messages.length > 0 ? messages.join(' ') : 'Needs significant improvement.');
    } else if (score < 40) {
      finalMessage = 'Weak: ' + (messages.length > 0 ? messages.join(' ') : 'Consider adding more complexity.');
    } else if (score < 60) {
      finalMessage = 'Moderate: ' + (messages.length > 0 ? messages.join(' ') : 'Good, but could be stronger.');
    } else if (score < 80) {
      finalMessage = 'Strong: ' + (messages.length > 0 ? messages.join(' ') : 'Excellent password!');
    } else {
      finalMessage = 'Very Strong: ' + (messages.length > 0 ? messages.join(' ') : 'Great job!');
    }

    return { score, message: finalMessage };
  };

  useEffect(() => {
    const { score, message } = evaluatePasswordStrength(password);
    setStrengthScore(score);
    setFeedbackMessage(message);
  }, [password]);

  const getStrengthBarColor = useMemo(() => {
    if (strengthScore < 20) return alertBorderIconColor; // Very Weak (Red)
    if (strengthScore < 40) return borderColor1;         // Weak (Orange)
    if (strengthScore < 60) return borderColor2;         // Moderate (Blue)
    if (strengthScore < 80) return '#4CAF50';            // Strong (Green)
    return '#28A745';                                    // Very Strong (Darker Green)
  }, [strengthScore, alertBorderIconColor, borderColor1, borderColor2]);

  return (
    <div
      className="
        flex flex-col items-center justify-start p-6 rounded-lg
        border-[3px] border-solid border-black bg-white
        shadow-[0_5px_8px_8px_rgba(0,0,0,0.05)]
        max-w-xl mx-auto my-8
        font-['IBM_Plex_Sans']
      "
      style={{ backgroundColor: '#FFF2C2' }}
    >
      <img src={logoUrl} alt="Logo" className="w-24 h-auto mb-4" />

      <h1
        className="
          font-['IBM_Plex_Sans'] font-light text-[32px] leading-[44px] tracking-[-0.96px]
          text-black text-center mb-4
        "
      >
        Password Strength Checker
      </h1>

      <p
        className="
          font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]
          text-black text-center mb-6
        "
      >
        A standalone UI component designed to help users create stronger passwords by providing immediate visual and textual feedback on password strength as they type.
      </p>

      <div
        className="
          w-full p-4 rounded-md flex flex-col gap-4
          border-[2px] border-dashed border-[#B4B9CF]
        "
        style={{ backgroundColor: gameContentBg }}
      >
        <label
          htmlFor="password-input"
          id="password-label"
          className="
            font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]
            text-black mb-2 block
          "
        >
          Enter your password:
        </label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="
            w-full p-3 rounded-md border-[2px] border-solid border-[#B4B9CF]
            focus:outline-none focus:ring-2 focus:ring-[#027BE5] focus:border-transparent
            font-['IBM_Plex_Sans'] text-[16px] leading-[26px] tracking-[-0.32px]
            text-black placeholder-gray-500
          "
          aria-labelledby="password-label"
          aria-describedby="feedback-message-text"
        />

        <div className="mt-4">
          <p
            id="strength-indicator-label"
            className="
              font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]
              text-black mb-2
            "
          >
            Password Strength:
          </p>
          <div
            id="strength-bar-container"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Password Strength"
            className="w-full h-3 rounded-full bg-gray-300 overflow-hidden"
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: \`\${strengthScore}%\`,
                backgroundColor: getStrengthBarColor,
              }}
            ></div>
          </div>
        </div>

        <p
          id="feedback-message-text"
          aria-live="polite"
          className={\`
            font-['IBM_Plex_Sans'] font-normal text-[16px] leading-[26px] tracking-[-0.32px]
            mt-4 p-2 rounded-md
            \${strengthScore < 40 ? \`text-[\${alertBorderIconColor}] bg-[\${alertBackground}] border-[1px] border-solid border-[\${alertBorderIconColor}]\` : 'text-black'}
          \`}
        >
          {feedbackMessage}
        </p>
      </div>
    </div>
  );
};

export default PasswordStrengthCheckerMain;
`;

export default code;