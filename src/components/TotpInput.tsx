import { ClipboardEvent, KeyboardEvent, useMemo, useRef, useState } from "react";

type TotpInputProps = {
  invalid?: boolean;
  onComplete?: (code: string) => void;
};

export function TotpInput({ invalid = false, onComplete }: TotpInputProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const code = useMemo(() => digits.join(""), [digits]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) refs.current[index + 1]?.focus();
    const completed = next.join("");
    if (completed.length === 6) onComplete?.(completed);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: 6 }, (_, index) => pasted[index] ?? "");
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) onComplete?.(pasted);
  }

  return (
    <div
      className="authink-totp"
      data-invalid={invalid || undefined}
      onPaste={handlePaste}
      role="group"
      aria-label="六位动态验证码"
      data-complete={code.length === 6 || undefined}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={element => { refs.current[index] = element; }}
          className="authink-totp__input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`验证码第 ${index + 1} 位`}
          maxLength={1}
          value={digit}
          onChange={event => updateDigit(index, event.target.value)}
          onKeyDown={event => handleKeyDown(index, event)}
        />
      ))}
    </div>
  );
}
