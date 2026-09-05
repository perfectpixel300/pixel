import React, { useMemo } from "react";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";
import { COUNTRIES, validatePhoneNumber, getCountryByCodeOrIso } from "../../utils/phoneValidation";

export function CountryPhoneInput({
  label = "Contact Number",
  required = false,
  countryCode = "+977",
  onCountryCodeChange,
  value = "",
  onChange,
  disabled = false,
  errorText,
}) {
  const selectedCountry = useMemo(() => {
    return getCountryByCodeOrIso(countryCode);
  }, [countryCode]);

  const validation = useMemo(() => {
    if (!value || !value.trim()) {
      return { isEmpty: true, isValid: false, message: "" };
    }
    return validatePhoneNumber(value, countryCode);
  }, [value, countryCode]);

  const hasValue = Boolean(value && value.trim().length > 0);
  const isVerified = hasValue && validation.isValid;
  const isInvalid = hasValue && !validation.isValid;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label} {required ? <span className="text-rose-400">*</span> : <span className="text-[var(--text-muted)] lowercase font-normal">(optional)</span>}
        </label>

        {isVerified && (
          <span className="text-[0.68rem] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle size={12} />
            <span>Format Verified</span>
          </span>
        )}
      </div>

      {/* Input Group: Country Selector on the left, Phone input on the right */}
      <div className="flex items-stretch rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus-within:border-white transition-colors overflow-hidden bg-[var(--bg-input)]">
        {/* Country Selector Dropdown */}
        <div className="relative shrink-0 border-r border-[var(--border-medium)] bg-[var(--bg-elevated)] flex items-center">
          <select
            value={countryCode}
            disabled={disabled}
            onChange={(e) => onCountryCodeChange && onCountryCodeChange(e.target.value)}
            className="appearance-none bg-transparent pl-2.5 pr-6 py-2.5 text-xs font-medium text-[var(--text-primary)] cursor-pointer focus:outline-none"
            title="Select Country Dial Code"
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.code} className="bg-zinc-900 text-white">
                {c.flag} {c.code} ({c.name})
              </option>
            ))}
          </select>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[0.6rem] text-[var(--text-muted)]">
            ▼
          </div>
        </div>

        {/* Number Input Field */}
        <div className="relative flex-1 flex items-center">
          <Phone
            size={14}
            className={`absolute left-3 pointer-events-none ${
              isVerified ? "text-emerald-400" : isInvalid ? "text-rose-400" : "text-[var(--text-muted)]"
            }`}
          />
          <input
            type="tel"
            disabled={disabled}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={selectedCountry.placeholder || "Phone digits"}
            className="w-full bg-transparent pl-8.5 pr-8 py-2.5 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)]"
          />
          {isVerified && (
            <CheckCircle
              size={15}
              className="absolute right-3 text-emerald-400 pointer-events-none shrink-0"
            />
          )}
          {isInvalid && (
            <AlertCircle
              size={15}
              className="absolute right-3 text-rose-400 pointer-events-none shrink-0"
            />
          )}
        </div>
      </div>

      {/* Validation Message / Helper Guidance */}
      <div className="mt-1">
        {errorText ? (
          <div className="text-[0.7rem] text-rose-400 flex items-center gap-1">
            <AlertCircle size={11} />
            <span>{errorText}</span>
          </div>
        ) : isVerified ? (
          <div className="text-[0.7rem] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle size={11} />
            <span>{validation.message}</span>
          </div>
        ) : isInvalid ? (
          <div className="text-[0.7rem] text-rose-400 flex items-center gap-1">
            <AlertCircle size={11} />
            <span>{validation.message}</span>
          </div>
        ) : (
          <div className="text-[0.68rem] text-[var(--text-muted)]">
            {required ? (
              <span>{selectedCountry.name}: {selectedCountry.formatHelp}</span>
            ) : (
              <span>Optional alternate number (e.g. WhatsApp, landline, family contact)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
