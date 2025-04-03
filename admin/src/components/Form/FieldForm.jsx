import React, { useState, useEffect } from "react";

const FieldForm = ({ field, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    label: "",
    name: "",
    type: "text",
    options: [],
    required: false,
    defaultValue: "",
  });

  // ✅ Reset formData when field prop changes (switching between Edit & Add)
  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        label: "",
        name: "",
        type: "text",
        options: [],
        required: false,
        defaultValue: "",
      });
    }
  }, [field]); // ✅ Runs whenever `field` changes

  useEffect(() => {
    if (formData.label) {
      const generatedName = formData.label
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "");
      setFormData((prev) => ({ ...prev, name: generatedName }));
    }
  }, [formData.label]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label || !formData.type) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
      >
        <h3 className="text-xl mb-4">
          {field ? "Edit Field" : "Add New Field"}
        </h3>

        {/* Field Label */}
        <label className="text-sm">Field Label</label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="Field Label"
          className="block w-full p-2 mb-2 border rounded"
          required
        />

        {/* Field Name */}
        <label className="text-sm">
          Field Name{" "}
          <span className="text-[0.8rem] text-orange-900">
            (Will be visiable when the email is sent)
          </span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Field Name"
          className="block w-full p-2 mb-2 border rounded"
          required
        />

        {/* Field Type Selection */}
        <label className="text-sm">Field Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="block w-full p-2 mb-2 border rounded"
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="textarea">Textarea</option>
          <option value="select">Dropdown (Select)</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio Buttons</option>
          <option value="date">Date</option>
        </select>

        {/* Default Value */}
        {formData.type !== "checkbox" && formData.type !== "radio" && (
          <input
            type="text"
            name="defaultValue"
            value={formData.defaultValue}
            onChange={handleChange}
            placeholder="Default Value (optional)"
            className="block w-full p-2 mb-2 border rounded"
          />
        )}

        {/* Required Checkbox */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="required"
            checked={formData.required}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="text-md">Required</label>
        </div>

        {/* Options (For Select, Checkbox, and Radio Fields) */}
        {(formData.type === "select" ||
          formData.type === "checkbox" ||
          formData.type === "radio") && (
          <div className="mb-4">
            <h4 className="text-md font-medium">Options:</h4>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="text-blue-500 mt-2"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FieldForm;
