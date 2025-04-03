import React, { useState, useEffect } from 'react';
import { getUnavailableDates, addUnavailableDate, removeUnavailableDate } from '../../api/formAPI';
import { toast } from 'react-toastify';

const UnavailableDatesManager = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState('');
  
  // Format today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    setLoading(true);
    try {
      const unavailableDates = await getUnavailableDates();
      // Sort dates in ascending order
      const sortedDates = [...unavailableDates].sort((a, b) => new Date(a) - new Date(b));
      setDates(sortedDates);
    } catch (error) {
      toast.error("Failed to load unavailable dates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    if (!newDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      await addUnavailableDate(newDate);
      toast.success("Date added successfully");
      setNewDate(''); // Reset input
      fetchDates();
    } catch (error) {
      toast.error("Failed to add date");
    }
  };

  const handleRemoveDate = async (date) => {
    try {
      await removeUnavailableDate(date);
      toast.success("Date removed successfully");
      fetchDates();
    } catch (error) {
      toast.error("Failed to remove date");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manage Unavailable Dates</h2>
      <p className="text-sm text-gray-600 mb-4">
        Set dates when customers cannot book appointments or services. These dates will be disabled in the date picker.
      </p>
      
      {/* Add new date */}
      <form onSubmit={handleAddDate} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={today}
            className="p-2 border rounded-md flex-grow"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Date
          </button>
        </div>
      </form>
      
      {/* Display unavailable dates */}
      <div>
        <h3 className="font-medium mb-3">Current Unavailable Dates</h3>
        {loading ? (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : dates.length === 0 ? (
          <p className="text-gray-500 italic">No unavailable dates set.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {dates.map((date, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
              >
                <span>{formatDate(date)}</span>
                <button
                  onClick={() => handleRemoveDate(date)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove date"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnavailableDatesManager;