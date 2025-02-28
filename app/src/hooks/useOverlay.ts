import { useState } from "react";

export const useOverlay = (initialValue = false, isOverlayFixed = false) => {
  const [showingOverlay, setShowingOverlay] = useState(initialValue);
  const isTouchDevice = () => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  const handleMouseEnter = (isOverlayFixed: boolean) => {
    if (isTouchDevice() || isOverlayFixed) return;
    setShowingOverlay(true);
  };

  const handleMouseLeave = (isOverlayFixed: boolean) => {
    if (isTouchDevice() || isOverlayFixed) return;
    setShowingOverlay(false);
  };

  const handleTouchStart = (isOverlayFixed: boolean) => {
    if (isOverlayFixed) return;
    setShowingOverlay((prev) => !prev);
  };

  return {
    showingOverlay,
    containerProps: {
      onMouseEnter: () => handleMouseEnter(isOverlayFixed),
      onMouseLeave: () => handleMouseLeave(isOverlayFixed),
      onTouchStart: () => handleTouchStart(isOverlayFixed),
    },
  };
};
