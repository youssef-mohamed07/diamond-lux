import React, { useState, useEffect } from "react";
import "./DoubleRangeSlider.css";

const DoubleRangeSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
  prefix = "",
  suffix = "",
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(val);
    onChange([val, maxValue]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(val);
    onChange([minValue, val]);
  };

  const handleMinInput = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val)) val = min;
    val = Math.max(min, Math.min(val, maxValue - step));
    setMinValue(val);
    onChange([val, maxValue]);
  };

  const handleMaxInput = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val)) val = max;
    val = Math.min(max, Math.max(val, minValue + step));
    setMaxValue(val);
    onChange([minValue, val]);
  };

  return (
    <div className="double-range-slider">
      <div className="inputs">
        <input
          type="number"
          value={minValue}
          min={min}
          max={maxValue - step}
          onChange={handleMinInput}
          className="range-input"
        />
        <span className="label">{minLabel}</span>
        <input
          type="number"
          value={maxValue}
          min={minValue + step}
          max={max}
          onChange={handleMaxInput}
          className="range-input"
        />
        <span className="label">{maxLabel}</span>
      </div>
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
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
          {minValue}
          {suffix}
        </span>
        <span>
          {prefix}
          {maxValue}
          {suffix}
        </span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider; 