import React, { useState, useEffect } from "react";

export default function Carousel({ children, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safely convert children to an array
  const childrenArray = React.Children.toArray(children);

  // If no children exist, return null gracefully instead of crashing
  if (childrenArray.length === 0) {
    return null;
  }

  // Automatic timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
    }, interval);

    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, [childrenArray.length, interval]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + childrenArray.length) % childrenArray.length);
  };

  return (
    <div className="carousel" style={{ position: "relative", textAlign: "center" }}>
      <div className="carousel-content">
        {childrenArray[currentIndex]}
      </div>
      <button onClick={goToPrevious}>Previous</button>
      <button onClick={goToNext}>Next</button>
    </div>
  );
}
