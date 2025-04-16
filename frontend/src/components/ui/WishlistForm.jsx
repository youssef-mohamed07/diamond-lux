import React, { useState, useEffect } from "react";
import { getFormFields, getUnavailableDates } from "../../../api/formAPI";
import { toast } from "react-toastify";
const today = new Date();
today.setHours(0, 0, 0, 0); // Set to midnight for accurate date comparison
import MaterialDatePicker from "./MaterialDatePicker";

const WishlistForm = ({
  onSubmit,
  onClose,
  page = false,
  sectionTitle = true,
  sectionDescription = true,
}) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({ phone: "+1" });
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setFieldsLoading(true);
      try {
        const fieldsData = await getFormFields();

        // Remove any phone fields from backend
        const fieldsWithoutPhone = fieldsData.filter(
          (field) =>
            !["phone", "telephone", "tel", "phone_number"].includes(
              field.name.toLowerCase()
            )
        );

        // Add our standardized phone field
        const allFields = [
          ...fieldsWithoutPhone,
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            required: true,
          },
        ];

        setFields(allFields);

        // Initialize form data with empty strings
        const initialData = {};
        allFields.forEach((field) => {
          initialData[field.name] = field.defaultValue || "";
        });
        setFormData(initialData);

        // Fetch unavailable dates
        const dates = await getUnavailableDates();
        setUnavailableDates(dates);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form. Please try again later.");
      } finally {
        setFieldsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPhoneNumber = (value) => {
    // If empty or just "+", return "+1"
    if (!value || value === "+") return "+1";

    // Remove the plus if it exists to handle the formatting
    const withoutPlus = value.startsWith("+") ? value.slice(1) : value;

    // Only keep numbers and spaces
    const cleaned = withoutPlus.replace(/[^\d\s]/g, "");

    // Ensure it starts with "1" if it doesn't already
    const withCountryCode = cleaned.startsWith("1") ? cleaned : "1" + cleaned;

    // Limit to 11 digits (1 + 10) plus spaces
    const digits = withCountryCode.replace(/\s/g, "").slice(0, 11);

    // Return raw input if it's just spaces and numbers and 11 or fewer digits
    if (cleaned.length <= 15) {
      // 11 digits + up to 4 spaces
      return "+" + withCountryCode;
    }

    return "+" + digits.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "phone"
          ? formatPhoneNumber(value)
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    // Check for empty required fields and date validation
    const missingFields = fields.filter((field) => {
      if (!field.required) return false;

      const value = formData[field.name];

      // Special check for date fields
      if (field.type === "date") {
        if (!value) return true;
        // Check if date is not before today
        return value < today;
      }

      // Check if the value is empty or undefined
      return !value || value.trim() === "";
    });

    if (missingFields.length > 0) {
      const dateError = missingFields.find(
        (f) => f.type === "date" && formData[f.name] < today
      );
      if (dateError) {
        toast.error("Please select a future date");
      } else {
        toast.error(
          `Please fill in all required fields: ${missingFields
            .map((f) => f.label)
            .join(", ")}`
        );
      }
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);

      // Reset form data
      const resetData = {};
      fields.forEach((field) => {
        resetData[field.name] = "";
      });
      setFormData(resetData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`${
        page
          ? "max-w-full px-4 sm:px-6 lg:px-8 py-12 z-50"
          : "fixed inset-0 bg-black bg-opacity-50 flex z-50 justify-center items-center"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 sm:p-8 shadow-md ${
          page
            ? "max-w-[1200px] mx-auto"
            : "max-w-[700px] w-full mx-4 sm:mx-auto overflow-y-auto max-h-[90vh]"
        }`}
      >
        {sectionTitle && sectionDescription && (
          <div className="mb-8 sm:mb-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                Wishlist
              </h2>
              {!page && (
                <button type="button" onClick={onClose}>
                  <span className="text-md hover:text-gray-500 transition-all duration-300 cursor-pointer">
                    X
                  </span>
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm sm:text-[0.95rem]">
              Please fill out the form below to send us your wishlist. We will
              review your submission and get back to you shortly.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:gap-6">
          {fieldsLoading ? (
            // Skeleton UI for loading fields
            <>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="mb-4">
                  <div className="h-5 w-32 bg-gray-300 animate-pulse mb-2 rounded"></div>
                  <div className="h-12 w-full bg-gray-300 animate-pulse rounded-md"></div>
                </div>
              ))}
              <div className="flex justify-start gap-2 mt-6 sm:mt-8">
                <div className="h-14 w-32 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </>
          ) : fields.length === 0 ? (
            <p className="text-gray-500">No form fields available.</p>
          ) : (
            fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="text-md font-medium">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 w-full bg-gray-100 rounded-md"
                  />
                )}
                {field.type === "email" && (
                  <input
                    type="email"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 w-full bg-gray-100 rounded-md"
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 w-full bg-gray-100 rounded-md"
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows="3"
                    className="p-3 w-full bg-gray-100 rounded-md"
                  ></textarea>
                )}
                {field.type === "select" && (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 w-full bg-gray-100 rounded-md"
                  >
                    {field.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "tel" && (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555 123 4567"
                    pattern="\+1\s?\d{3}\s?\d{3}\s?\d{4}"
                    required
                    className="p-3 w-full bg-gray-100 rounded-md"
                  />
                )}
                {field.type === "date" && (
                  <div onClick={(e) => e.preventDefault()}>
                    <MaterialDatePicker
                      value={
                        formData[field.name]
                          ? new Date(formData[field.name])
                          : today
                      }
                      onChange={(date) => {
                        if (!date) return;

                        // Create YYYY-MM-DD format that preserves the selected date
                        // This is crucial to avoid timezone issues when storing the date
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day}`;

                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: formattedDate,
                        }));
                      }}
                      minDate={today}
                      unavailableDates={unavailableDates}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!fieldsLoading && (
          <div className="flex justify-start gap-2 mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`bg-black text-white px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl transition-all duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default WishlistForm;
