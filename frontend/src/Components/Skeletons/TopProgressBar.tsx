import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const TopProgressBar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // When location changes, start progress animation
    setLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => {
      setProgress(75);
    }, 150);

    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname, location.search]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand via-[#ff5a5f] to-brand transition-all duration-200 ease-out shadow-[0_0_8px_rgba(255,56,92,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: "width 250ms ease, opacity 200ms ease",
        }}
      />
    </div>
  );
};

export default TopProgressBar;
