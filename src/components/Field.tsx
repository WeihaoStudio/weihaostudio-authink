import { useId, useState } from "react";

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
};

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  defaultValue,
  required = true,
  error,
}: FieldProps) {
  const id = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && passwordVisible ? "text" : type;

  return (
    <label className="authink-field" htmlFor={id}>
      <span className="authink-field__label">{label}</span>
      <span className="authink-input-wrap">
        <input
          className={`authink-input${isPassword ? " authink-input--with-trailing" : ""}`}
          id={id}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPassword ? (
          <button
            className="authink-input__trailing"
            type="button"
            aria-label={passwordVisible ? "隐藏密码" : "显示密码"}
            onClick={() => setPasswordVisible(value => !value)}
          >
            <span aria-hidden="true">{passwordVisible ? "◉" : "◎"}</span>
          </button>
        ) : null}
      </span>
      {error ? (
        <span className="authink-field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
