import "./styles/LoginForm.css";

interface Props {
  type: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

export default function SharedInput({
  type,
  placeholder,
  value,
  onChange,
  label,
  className = "",
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-base ${className}`}
        required
      />
    </div>
  );
}