import { useEffect, useState } from "react";

const useTimer = (duration: number, onEnd: () => void) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onEnd]);

  return timeLeft;
};

export default useTimer;
