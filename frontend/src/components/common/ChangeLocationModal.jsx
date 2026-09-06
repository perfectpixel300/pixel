import React, { useState, useEffect } from "react";
import { X, Check, Truck, Compass } from "lucide-react";
import { NepalLocationSelector } from "./NepalLocationSelector";
import { parseNepalAddress } from "../../utils/nepalLocations";

export function ChangeLocationModal({
  isOpen,
  onClose,
  title = "Choose Delivery Location",
  initialAddress = "",
  initialLandmark = "",
  onConfirm,
}) {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [nearbyLandmark, setNearbyLandmark] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setFullAddress(initialAddress || "");
      setNearbyLandmark(initialLandmark || "");
      if (initialAddress) {
        const parsed = parseNepalAddress(initialAddress);
        setProvince(parsed.province || "");
        setDistrict(parsed.district || "");
        setCity(parsed.city || "");
        setStreetAddress(parsed.streetAddress || "");
      } else {
        setProvince("");
        setDistrict("");
        setCity("");
        setStreetAddress("");
      }
    }
  }, [isOpen, initialAddress, initialLandmark]);

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    if (e) e.preventDefault();
    if (!province || !district || !streetAddress.trim()) {
      setError("Please select Province, District, and enter Street/Tole address.");
      return;
    }
    const finalFormatted = fullAddress.trim();
    if (!finalFormatted) {
      setError("Please provide a valid delivery location.");
      return;
    }
    if (onConfirm) {
      onConfirm(finalFormatted, {
        province,
        district,
        city,
        streetAddress,
        nearbyLandmark: (nearbyLandmark || "").trim(),
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay z-[110]" onClick={onClose}>
      <div
        className="modal-card w-[calc(100%-1.5rem)] sm:w-full max-w-[540px] max-h-[90vh] flex flex-col overflow-hidden mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)]">
              <Truck size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">{title}</h3>
              <span className="text-[0.725rem] text-[var(--text-muted)]">
                Select your delivery destination across Nepal
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body overflow-y-auto minimal-scrollbar py-5">
          {error && (
            <div className="p-2.5 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-[0.8rem] mb-3">
              {error}
            </div>
          )}

          <NepalLocationSelector
            label="Delivery Destination"
            required={true}
            province={province}
            onProvinceChange={setProvince}
            district={district}
            onDistrictChange={setDistrict}
            city={city}
            onCityChange={setCity}
            streetAddress={streetAddress}
            onStreetAddressChange={setStreetAddress}
            fullAddress={fullAddress}
            onAddressChange={(formatted, details) => {
              setFullAddress(formatted);
              if (details.province) setProvince(details.province);
              if (details.district) setDistrict(details.district);
              if (details.city) setCity(details.city);
              if (details.streetAddress !== undefined) setStreetAddress(details.streetAddress);
            }}
          />

          {/* Nearby Landmark */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Nearby Landmark
              </label>
              <span className="text-[0.675rem] text-[var(--text-muted)]">Optional</span>
            </div>
            <div className="relative flex items-center">
              <Compass size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                value={nearbyLandmark}
                onChange={(e) => setNearbyLandmark(e.target.value)}
                placeholder="e.g. Opposite to Civil Bank, Near Eye Hospital"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2 px-3 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer shrink-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Check size={14} />
            <span>Confirm Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
