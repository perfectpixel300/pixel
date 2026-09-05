// 10 Supported Countries with validation rules (Nepal must be first)
export const COUNTRIES = [
  {
    code: "+977",
    name: "Nepal",
    flag: "🇳🇵",
    iso: "NP",
    placeholder: "98XXXXXXXX",
    minDigits: 10,
    maxDigits: 10,
    regex: /^(?:9[678]\d{8}|0\d{7,8})$/,
    formatHelp: "10 digits starting with 98, 97, or 96 (e.g. 9801234567)",
  },
  {
    code: "+91",
    name: "India",
    flag: "🇮🇳",
    iso: "IN",
    placeholder: "98XXXXXXXX",
    minDigits: 10,
    maxDigits: 10,
    regex: /^[6-9]\d{9}$/,
    formatHelp: "10 digits starting with 6, 7, 8, or 9",
  },
  {
    code: "+1",
    name: "United States",
    flag: "🇺🇸",
    iso: "US",
    placeholder: "2025550123",
    minDigits: 10,
    maxDigits: 10,
    regex: /^[2-9]\d{9}$/,
    formatHelp: "10-digit standard US number",
  },
  {
    code: "+44",
    name: "United Kingdom",
    flag: "🇬🇧",
    iso: "GB",
    placeholder: "7911123456",
    minDigits: 10,
    maxDigits: 11,
    regex: /^0?7\d{9}$/,
    formatHelp: "10-11 digits UK mobile starting with 7",
  },
  {
    code: "+61",
    name: "Australia",
    flag: "🇦🇺",
    iso: "AU",
    placeholder: "412345678",
    minDigits: 9,
    maxDigits: 10,
    regex: /^0?4\d{8}$/,
    formatHelp: "9 digits starting with 4 (or 04...)",
  },
  {
    code: "+1",
    name: "Canada",
    flag: "🇨🇦",
    iso: "CA",
    placeholder: "4165550198",
    minDigits: 10,
    maxDigits: 10,
    regex: /^[2-9]\d{9}$/,
    formatHelp: "10-digit standard Canadian number",
  },
  {
    code: "+971",
    name: "UAE",
    flag: "🇦🇪",
    iso: "AE",
    placeholder: "501234567",
    minDigits: 9,
    maxDigits: 9,
    regex: /^0?5\d{8}$/,
    formatHelp: "9 digits starting with 5 (e.g. 50XXXXXXX)",
  },
  {
    code: "+81",
    name: "Japan",
    flag: "🇯🇵",
    iso: "JP",
    placeholder: "9012345678",
    minDigits: 10,
    maxDigits: 11,
    regex: /^0?[789]0\d{8}$/,
    formatHelp: "10-11 digits starting with 70, 80, or 90",
  },
  {
    code: "+49",
    name: "Germany",
    flag: "🇩🇪",
    iso: "DE",
    placeholder: "15123456789",
    minDigits: 10,
    maxDigits: 11,
    regex: /^0?1[567]\d{8,9}$/,
    formatHelp: "10-11 digits mobile starting with 15, 16, or 17",
  },
  {
    code: "+65",
    name: "Singapore",
    flag: "🇸🇬",
    iso: "SG",
    placeholder: "81234567",
    minDigits: 8,
    maxDigits: 8,
    regex: /^[89]\d{7}$/,
    formatHelp: "8 digits starting with 8 or 9",
  },
];

export function getCountryByCodeOrIso(val = "+977") {
  if (!val) return COUNTRIES[0];
  const found = COUNTRIES.find((c) => c.code === val || c.iso === val);
  return found || COUNTRIES[0];
}

export function validatePhoneNumber(rawNumber, countryCode = "+977") {
  if (!rawNumber || !rawNumber.toString().trim()) {
    return {
      isValid: false,
      isEmpty: true,
      cleanNumber: "",
      message: "Contact number is required",
    };
  }

  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  let clean = rawNumber.toString().replace(/[\s\-\(\)\.]/g, "");

  // If user entered leading "+" with country code, strip it
  const pureCode = country.code.replace("+", "");
  if (clean.startsWith(`+${pureCode}`)) {
    clean = clean.slice(pureCode.length + 1);
  } else if (clean.startsWith(pureCode) && clean.length > country.minDigits) {
    clean = clean.slice(pureCode.length);
  }

  if (!/^\d+$/.test(clean)) {
    return {
      isValid: false,
      isEmpty: false,
      cleanNumber: clean,
      country,
      message: "Number must contain digits only",
    };
  }

  if (country.regex && !country.regex.test(clean)) {
    return {
      isValid: false,
      isEmpty: false,
      cleanNumber: clean,
      country,
      message: `Invalid format for ${country.name}. ${country.formatHelp}`,
    };
  }

  if (clean.length < country.minDigits || clean.length > country.maxDigits) {
    return {
      isValid: false,
      isEmpty: false,
      cleanNumber: clean,
      country,
      message: `${country.name} number must be ${
        country.minDigits === country.maxDigits
          ? `${country.minDigits} digits`
          : `${country.minDigits}-${country.maxDigits} digits`
      } (currently ${clean.length})`,
    };
  }

  return {
    isValid: true,
    isEmpty: false,
    cleanNumber: clean,
    country,
    message: `Verified valid for ${country.name} (${country.code})`,
  };
}
