import { useState } from "react";

export const useOverlay = (initialValue = false, isOverlayFixed = false) => {
  const [showingOverlay, setShowingOverlay] = useState(initialValue);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const handleMouseEnter = (isOverlayFixed: boolean) => {
    if (isTouchDevice || isOverlayFixed) return;
    setShowingOverlay(true);
  };

  const handleMouseLeave = (isOverlayFixed: boolean) => {
    if (isTouchDevice || isOverlayFixed) return;
    setShowingOverlay(false);
  };

  const handleClick = (isOverlayFixed: boolean) => {
    if (isTouchDevice || isOverlayFixed) return;
    setShowingOverlay((prev) => !prev);
  };

  const handleTouchStart = (isOverlayFixed: boolean) => {
    if (isOverlayFixed) return;
    setIsTouchDevice(true);
    setShowingOverlay((prev) => !prev);
  };

  return {
    showingOverlay,
    containerProps: {
      onMouseEnter: () => handleMouseEnter(isOverlayFixed),
      onMouseLeave: () => handleMouseLeave(isOverlayFixed),
      onClick: () => handleClick(isOverlayFixed),
      onTouchStart: () => handleTouchStart(isOverlayFixed),
    },
  };
};
