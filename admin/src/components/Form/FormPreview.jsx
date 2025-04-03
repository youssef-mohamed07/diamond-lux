import React from "react";

const FormPreview = ({ fields }) => {
  return (
    <div className="cursor-not-allowed">
      <div className="bg-white p-6 md:p-8 shadow-md rounded-lg w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Form Preview</h2>
          <p className="text-gray-500 text-sm">
            This is how your form will appear to users.
          </p>
        </div>

        {/* Dynamic Form Fields */}
        <div className="flex flex-col gap-4 ">
          {fields.length === 0 ? (
            <p className="text-gray-500">
              No fields available. Please add fields from settings.
            </p>
          ) : (
            fields.map((field, index) => (
              <div
                key={field._id || `${field.name}-${index}`}
                className="mb-4 "
              >
                <label className="block text-md md:text-lg font-medium mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {/* 🔥 Handle All Field Types Correctly */}
                {field.type === "text" && (
                  <input
                    type="text"
                    name={field.name}
                    defaultValue={field.defaultValue}
                    className="p-3 w-full bg-gray-100 rounded-md cursor-not-allowed"
                    disabled
                  />
                )}
                {field.type === "email" && (
                  <input
                    type="email"
                    name={field.name}
                    defaultValue={field.defaultValue}
                    className="p-3 w-full bg-gray-100 rounded-md cursor-not-allowed"
                    disabled
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    name={field.name}
                    defaultValue={field.defaultValue}
                    className="p-3 w-full bg-gray-100 rounded-md cursor-not-allowed"
                    disabled
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    name={field.name}
                    defaultValue={field.defaultValue}
                    className="p-3 w-full bg-gray-100 rounded-md cursor-not-allowed"
                    rows="3"
                    disabled
                  ></textarea>
                )}
                {field.type === "select" && (
                  <select
                    name={field.name}
                    className="p-3 w-full bg-gray-100 rounded-md"
                  >
                    {field.options.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        disabled
                        className="cursor-not-allowed"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "checkbox" && (
                  <div className="flex flex-col gap-2 mt-2">
                    {field.options.map((option, index) => (
                      <label key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option}
                          className="w-5 h-5"
                          disabled
                        />{" "}
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "radio" && (
                  <div className="flex flex-col gap-2 mt-2">
                    {field.options.map((option, index) => (
                      <label key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          className="w-5 h-5 cursor-not-allowed"
                          disabled
                        />{" "}
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === "date" && (
                  <input
                    type="date"
                    name={field.name}
                    defaultValue={field.defaultValue}
                    className="p-3 w-full bg-gray-100 rounded-md cursor-not-allowed"
                    disabled
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
