import { useState, useEffect } from "react";

interface LoadingScreenProps {
  /** Optional duration in milliseconds after which the loading screen automatically hides. Default is 2500ms. */
  duration?: number;
  /** Force loading state visibility if provided */
  isLoading?: boolean;
  /** Optional callback when loading completes */
  onFinished?: () => void;
}

export function LoadingScreen({ duration = 2500, isLoading, onFinished }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isLoading !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(isLoading);
      return;
    }

    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isLoading, onFinished]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-xl font-medium tracking-[0.05em] mb-2">
        Loading ...
      </h1>
      <img
        src="/running-fox.gif"
        alt="Running Fox Loading"
        className="w-[120px] h-auto"
      />
    </div>
  );
}

export default LoadingScreen;
