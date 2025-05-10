import React, { useState, useEffect, useCallback } from "react";
import "./DoubleRangeSlider.css";

const DoubleRangeSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  prefix = "",
  suffix = "",
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = useCallback((e) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(newMin);
    onChange({ min: newMin, max: maxValue });
  }, [maxValue, step, onChange]);

  const handleMaxChange = useCallback((e) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(newMax);
    onChange({ min: minValue, max: newMax });
  }, [minValue, step, onChange]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Format the value for display
  const formatValue = (val) => {
    if (step < 1) {
      return val.toFixed(2);
    }
    return Math.round(val).toLocaleString();
  };

  return (
    <div className="double-range-slider">
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="thumb thumb--left"
          style={{ zIndex: minValue > max - 100 ? "5" : "3" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="thumb thumb--right"
        />
        <div className="slider">
          <div className="slider__track" />
          <div
            className="slider__range"
            style={{
              left: `${((minValue - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="slider-values">
        <span>
          {prefix}
          {formatValue(minValue)}
          {suffix}
        </span>
        <span>
          {prefix}
          {formatValue(maxValue)}
          {suffix}
        </span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider; 