import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Building2, Home, ChevronDown, CheckCircle2, Navigation } from "lucide-react";
import {
  NEPAL_PROVINCES,
  getDistrictsByProvince,
  getCitiesByDistrict,
  formatNepalAddress,
  parseNepalAddress,
} from "../../utils/nepalLocations";

export function NepalLocationSelector({
  label = "Delivery Address",
  required = true,
  province: controlledProvince,
  onProvinceChange,
  district: controlledDistrict,
  onDistrictChange,
  city: controlledCity,
  onCityChange,
  streetAddress: controlledStreet,
  onStreetAddressChange,
  fullAddress = "",
  onAddressChange,
  disabled = false,
  error = "",
}) {
  // Internal state when not fully controlled
  const [internalProvince, setInternalProvince] = useState("");
  const [internalDistrict, setInternalDistrict] = useState("");
  const [internalCity, setInternalCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [internalStreet, setInternalStreet] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const selectedProvince = controlledProvince !== undefined ? controlledProvince : internalProvince;
  const selectedDistrict = controlledDistrict !== undefined ? controlledDistrict : internalDistrict;
  const selectedCity = controlledCity !== undefined ? controlledCity : internalCity;
  const selectedStreet = controlledStreet !== undefined ? controlledStreet : internalStreet;

  // Auto-parse existing fullAddress on initial load if province/district not explicitly supplied
  useEffect(() => {
    if (!isInitialized && fullAddress && !selectedProvince && !selectedDistrict) {
      const parsed = parseNepalAddress(fullAddress);
      if (parsed.province) {
        handleProvinceSelect(parsed.province, false);
      }
      if (parsed.district) {
        handleDistrictSelect(parsed.district, false);
      }
      if (parsed.city) {
        handleCitySelect(parsed.city, false);
      }
      if (parsed.streetAddress) {
        handleStreetChange(parsed.streetAddress, false);
      }
      setIsInitialized(true);
    }
  }, [fullAddress, isInitialized, selectedProvince, selectedDistrict]);

  // Available districts for the active province
  const availableDistricts = useMemo(() => {
    return getDistrictsByProvince(selectedProvince);
  }, [selectedProvince]);

  // Available cities/municipalities for active district
  const availableCities = useMemo(() => {
    return getCitiesByDistrict(selectedProvince, selectedDistrict);
  }, [selectedProvince, selectedDistrict]);

  // Broadcast unified address updates to parent
  const emitChange = (prov, dist, cty, str) => {
    const formatted = formatNepalAddress({
      province: prov,
      district: dist,
      city: cty,
      streetAddress: str,
    });

    if (onAddressChange) {
      onAddressChange(formatted, {
        province: prov,
        district: dist,
        city: cty,
        streetAddress: str,
      });
    }
  };

  const handleProvinceSelect = (newProvince, triggerEmit = true) => {
    if (onProvinceChange) onProvinceChange(newProvince);
    setInternalProvince(newProvince);

    // Reset downstream selections if province changes
    const newDistrict = "";
    const newCity = "";
    if (onDistrictChange) onDistrictChange(newDistrict);
    setInternalDistrict(newDistrict);
    if (onCityChange) onCityChange(newCity);
    setInternalCity(newCity);
    setCustomCity("");

    if (triggerEmit) {
      emitChange(newProvince, newDistrict, newCity, selectedStreet);
    }
  };

  const handleDistrictSelect = (newDistrict, triggerEmit = true) => {
    if (onDistrictChange) onDistrictChange(newDistrict);
    setInternalDistrict(newDistrict);

    const newCity = "";
    if (onCityChange) onCityChange(newCity);
    setInternalCity(newCity);
    setCustomCity("");

    if (triggerEmit) {
      emitChange(selectedProvince, newDistrict, newCity, selectedStreet);
    }
  };

  const handleCitySelect = (newCity, triggerEmit = true) => {
    let effectiveCity = newCity;
    if (newCity === "Other / Rural Area") {
      effectiveCity = customCity || "Other / Rural Area";
    }
    if (onCityChange) onCityChange(effectiveCity);
    setInternalCity(newCity);

    if (triggerEmit) {
      emitChange(selectedProvince, selectedDistrict, effectiveCity, selectedStreet);
    }
  };

  const handleCustomCityChange = (customVal) => {
    setCustomCity(customVal);
    if (onCityChange) onCityChange(customVal);
    emitChange(selectedProvince, selectedDistrict, customVal, selectedStreet);
  };

  const handleStreetChange = (newStreet, triggerEmit = true) => {
    if (onStreetAddressChange) onStreetAddressChange(newStreet);
    setInternalStreet(newStreet);

    const activeCity = internalCity === "Other / Rural Area" ? customCity : selectedCity;
    if (triggerEmit) {
      emitChange(selectedProvince, selectedDistrict, activeCity, newStreet);
    }
  };

  const currentFormatted = useMemo(() => {
    const activeCity = internalCity === "Other / Rural Area" ? customCity : selectedCity;
    return formatNepalAddress({
      province: selectedProvince,
      district: selectedDistrict,
      city: activeCity,
      streetAddress: selectedStreet,
    });
  }, [selectedProvince, selectedDistrict, selectedCity, selectedStreet, internalCity, customCity]);

  const isComplete = Boolean(selectedProvince && selectedDistrict && selectedStreet.trim());

  return (
    <div className="space-y-3">
      {/* Header with Nepal Badge */}
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label} {required ? <span className="text-rose-400">*</span> : <span className="text-[var(--text-muted)] lowercase font-normal">(optional)</span>}
        </label>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[0.68rem] font-bold tracking-wider uppercase">
          <span>🇳🇵 Nepal Only</span>
        </span>
      </div>

      {/* Grid: 2 Columns for Province & District Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Province Select Dropdown */}
        <div>
          <label className="block text-[0.7rem] font-medium text-[var(--text-muted)] mb-1">
            Province <span className="text-rose-400">*</span>
          </label>
          <div className="relative flex items-center rounded-[var(--radius-sm)] border border-[var(--border-medium)] bg-[var(--bg-input)] focus-within:border-white transition-colors overflow-hidden">
            <Navigation size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
            <select
              required={required}
              disabled={disabled}
              value={selectedProvince}
              onChange={(e) => handleProvinceSelect(e.target.value)}
              className="w-full !pl-9 !pr-8 py-2.5 text-xs sm:text-sm bg-transparent text-[var(--text-primary)] cursor-pointer focus:outline-none appearance-none font-medium"
            >
              <option value="" className="bg-[var(--bg-card)] text-[var(--text-muted)]">
                -- Select Province --
              </option>
              {NEPAL_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.name} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {prov.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        {/* District Select Dropdown */}
        <div>
          <label className="block text-[0.7rem] font-medium text-[var(--text-muted)] mb-1">
            District <span className="text-rose-400">*</span>
          </label>
          <div className="relative flex items-center rounded-[var(--radius-sm)] border border-[var(--border-medium)] bg-[var(--bg-input)] focus-within:border-white transition-colors overflow-hidden">
            <MapPin size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
            <select
              required={required}
              disabled={disabled || !selectedProvince}
              value={selectedDistrict}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              className={`w-full !pl-9 !pr-8 py-2.5 text-xs sm:text-sm bg-transparent text-[var(--text-primary)] cursor-pointer focus:outline-none appearance-none font-medium ${
                !selectedProvince ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="" className="bg-[var(--bg-card)] text-[var(--text-muted)]">
                {selectedProvince ? "-- Select District --" : "Choose Province First"}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist.name} value={dist.name} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {dist.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Municipality/City & Street/Tole */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Municipality / City Dropdown */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[0.7rem] font-medium text-[var(--text-muted)]">
              Municipality / City <span className="text-rose-400">*</span>
            </label>
            {selectedDistrict && (
              <span className="text-[0.625rem] text-[var(--text-muted)]">
                {availableCities.length} major areas
              </span>
            )}
          </div>
          <div className="relative flex items-center rounded-[var(--radius-sm)] border border-[var(--border-medium)] bg-[var(--bg-input)] focus-within:border-white transition-colors overflow-hidden">
            <Building2 size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
            <select
              required={required}
              disabled={disabled || !selectedDistrict}
              value={internalCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className={`w-full !pl-9 !pr-8 py-2.5 text-xs sm:text-sm bg-transparent text-[var(--text-primary)] cursor-pointer focus:outline-none appearance-none font-medium ${
                !selectedDistrict ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="" className="bg-[var(--bg-card)] text-[var(--text-muted)]">
                {selectedDistrict ? "-- Select Municipality / City --" : "Choose District First"}
              </option>
              {availableCities.map((cityItem) => (
                <option key={cityItem} value={cityItem} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {cityItem}
                </option>
              ))}
              {selectedDistrict && (
                <option value="Other / Rural Area" className="bg-[var(--bg-card)] text-amber-400">
                  + Other / Rural Municipality...
                </option>
              )}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Conditional Custom Municipality / Area Text Input if 'Other' selected */}
          {internalCity === "Other / Rural Area" && (
            <div className="mt-1.5 animate-fadeIn">
              <input
                type="text"
                required={required}
                disabled={disabled}
                value={customCity}
                onChange={(e) => handleCustomCityChange(e.target.value)}
                placeholder="Enter your Municipality or Area name"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] text-[var(--text-primary)] focus:border-white transition-colors"
              />
            </div>
          )}
        </div>

        {/* Street Address / Tole / Ward / Landmark */}
        <div>
          <label className="block text-[0.7rem] font-medium text-[var(--text-muted)] mb-1">
            Street Address / Tole / Ward <span className="text-rose-400">*</span>
          </label>
          <div className="relative flex items-center rounded-[var(--radius-sm)] border border-[var(--border-medium)] bg-[var(--bg-input)] focus-within:border-white transition-colors overflow-hidden">
            <Home size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              required={required}
              disabled={disabled}
              value={selectedStreet}
              onChange={(e) => handleStreetChange(e.target.value)}
              placeholder="e.g. Ward 10, New Baneshwor or House #45"
              className="w-full !pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)] font-medium"
            />
          </div>
        </div>
      </div>

      {/* Formatted Full Address Live Preview */}
      {currentFormatted && (
        <div className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-start gap-2 text-xs text-[var(--text-secondary)]">
          <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-[0.65rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Formatted Delivery Address:
            </div>
            <div className="font-semibold text-[var(--text-primary)] text-xs truncate">
              {currentFormatted}, Nepal
            </div>
          </div>
          {isComplete && (
            <span className="shrink-0 text-emerald-400 flex items-center gap-1 text-[0.65rem] font-bold">
              <CheckCircle2 size={13} />
              <span className="hidden sm:inline">Verified</span>
            </span>
          )}
        </div>
      )}

      {error && (
        <p className="text-[0.75rem] text-rose-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
