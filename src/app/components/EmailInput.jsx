import { useMemo, useState } from "react";
import { Input } from "./ui/input";

const EMAIL_DOMAINS = [
  "kfupm.edu.sa",
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
];

export function EmailInput({ value, onChange, className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const atIndex = value.indexOf("@");
    if (atIndex === -1) return [];

    const localPart = value.slice(0, atIndex).trim();
    const typedDomain = value.slice(atIndex + 1).toLowerCase();
    if (!localPart) return [];

    return EMAIL_DOMAINS.filter((domain) => domain.startsWith(typedDomain))
      .map((domain) => `${localPart}@${domain}`)
      .filter((suggestion) => suggestion.toLowerCase() !== value.toLowerCase());
  }, [value]);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="relative">
      <Input
        {...props}
        type="email"
        value={value}
        onChange={onChange}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        className={className}
      />

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="block w-full px-3 py-2 text-left text-sm hover:bg-orange-50 focus:bg-orange-50 focus:outline-none"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange({ target: { value: suggestion } });
                setIsFocused(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
