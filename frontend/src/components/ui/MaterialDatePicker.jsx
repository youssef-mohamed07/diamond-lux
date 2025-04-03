import React, { useState, useEffect, useRef } from 'react';

const MaterialDatePicker = ({ onChange, value, minDate, unavailableDates = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value || Date.now()));
  const [selectedDate, setSelectedDate] = useState(new Date(value || Date.now()));
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date(value || Date.now()));
  const modalRef = useRef(null);
  
  // Process unavailable dates to a consistent format
  const formattedUnavailableDates = unavailableDates.map(date => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setTempSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    // Handle clicking outside the modal to close it
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal(false); // Close without saving
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    // Reset temp date to current selected date
    setTempSelectedDate(new Date(selectedDate));
    setViewDate(new Date(selectedDate));
  };

  const closeModal = (saveChanges) => {
    setIsOpen(false);
    if (saveChanges) {
      setSelectedDate(tempSelectedDate);
      if (onChange) {
        // Use the same date formatting as in handleDayClick
        const year = tempSelectedDate.getFullYear();
        const month = tempSelectedDate.getMonth();
        const day = tempSelectedDate.getDate();
        const dateToSubmit = new Date(Date.UTC(year, month, day, 12, 0, 0));
        onChange(dateToSubmit);
      }
    }
    // If not saving changes, we just close without updating
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };
  
  const handleDayClick = (day) => {
    // The critical fix: Create date in local timezone with time at noon
    // to prevent any timezone conversion issues
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Create date with consistent time (noon) in local timezone
    const newDate = new Date(year, month, day, 12, 0, 0);
    
    // Format for comparison with unavailable dates
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if date is in the past
    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (newDate < minDateObj) return;
    }
    
    // Check if date is unavailable
    if (formattedUnavailableDates.includes(dateString)) return;
    
    // Update the temporary selected date
    setTempSelectedDate(newDate);
  };
  
  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create today date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date at noon to avoid timezone issues
      const currentDate = new Date(year, month, day, 12, 0, 0);
      
      // Format for comparison with unavailable dates
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if selected
      const isSelected = tempSelectedDate && 
                         tempSelectedDate.getDate() === day && 
                         tempSelectedDate.getMonth() === month && 
                         tempSelectedDate.getFullYear() === year;
      
      // Check if date is today
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      
      // Check if date is in the past
      const isPastDate = minDate && currentDate < new Date(minDate);
      
      // Check if date is unavailable
      const isUnavailable = formattedUnavailableDates.includes(dateString);
      
      // Determine cell classes based on conditions
      let cellClasses = "w-8 h-8 flex items-center justify-center rounded-full text-xs";
      
      if (isSelected) {
        cellClasses += " bg-blue-600 text-white";
      } else if (isToday) {
        cellClasses += " border border-blue-600 text-blue-600";
      } else if (isPastDate || isUnavailable) {
        cellClasses += " text-gray-400 cursor-not-allowed";
      } else {
        cellClasses += " hover:bg-gray-100 cursor-pointer";
      }
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isPastDate && !isUnavailable && handleDayClick(day)}
          className={cellClasses}
          disabled={isPastDate || isUnavailable}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  const formatDateDisplay = (date) => {
    if (!date) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="w-full relative">
      {/* Date Display Button */}
      <button
        type="button"
        onClick={openModal}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {formatDateDisplay(selectedDate) || "Select a date"}
      </button>
      
      {/* Modal Calendar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="w-full max-w-xs rounded-md bg-white shadow-xl overflow-hidden"
          >
            {/* Dark Header with Year and Selected Date */}
            <div className="bg-gray-800 text-white p-4">
              <p className="text-sm font-medium">{tempSelectedDate.getFullYear()}</p>
              <p className="text-2xl font-semibold">
                {months[tempSelectedDate.getMonth()].substring(0, 3)} {tempSelectedDate.getDate()}
              </p>
            </div>
            
            <div className="p-4">
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium">
                  {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={goToPreviousMonth}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                    aria-label="Previous month"
                  >
                    &lt;
                  </button>
                  <button 
                    type="button"
                    onClick={goToNextMonth}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                    aria-label="Next month"
                  >
                    &gt;
                  </button>
                </div>
              </div>
              
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {renderCalendarDays()}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end mt-2 space-x-4">
                <button
                  type="button"
                  className="text-blue-500 px-2 py-1 text-sm font-medium"
                  onClick={() => closeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-blue-500 px-2 py-1 text-sm font-medium"
                  onClick={() => closeModal(true)}
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialDatePicker;
