import React, { useState, useEffect, useRef } from "react";
import styles from "./carousel.module.css";

export default function Carousel({ children, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // Tracks active responsive columns
  const wrapperRef = useRef(null);
  
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  if (totalItems === 0) return null;

  // Calculate maximum index threshold to prevent sliding into blank space
  const maxIndex = Math.max(0, totalItems - visibleCount);

  // Automatically update column layout thresholds using ResizeObserver
  useEffect(() => {
    if (!wrapperRef.current) return;

    const handleResize = (entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width <= 600) setVisibleCount(1);
        else if (width <= 1024) setVisibleCount(2);
        else setVisibleCount(3);
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  // Automatic timer logic shifting from left to right
  useEffect(() => {
    if (maxIndex === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // If it reaches the end of the line, reset slide track to start
        if (prevIndex >= maxIndex) return 0;
        return prevIndex + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [maxIndex, interval]);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Dynamically calculate translation percentage based on items and gap spacing
  const gapSize = 20;
  const translateOffset = wrapperRef.current 
    ? (wrapperRef.current.clientWidth / visibleCount) * currentIndex + (gapSize * currentIndex)
    : 0;

  return (
    <div className={styles.carouselContainer}>
      {/* Left Trigger Button */}
      <button 
        className={`${styles.navButton} ${styles.prev}`} 
        onClick={goToPrevious}
        disabled={currentIndex === 0}
      >
        &#10094;
      </button>

      {/* Main Viewport Window */}
      <div className={styles.wrapper} ref={wrapperRef}>
        <div 
          className={styles.track}
          style={{ transform: `translateX(-${translateOffset}px)` }}
        >
          {childrenArray.map((child, index) => (
            <div key={index} className={styles.slide}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Right Trigger Button */}
      <button 
        className={`${styles.navButton} ${styles.next}`} 
        onClick={goToNext}
        disabled={currentIndex >= maxIndex}
      >
        &#10095;
      </button>
    </div>
  );
}
