import React from "react";

const FieldItem = ({
  field,
  index,
  totalFields,
  onEdit,
  onDelete,
  setFields,
  onReorder,
}) => {
  const moveField = async (direction) => {
    setFields((prevFields) => {
      const newOrder = [...prevFields];
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      [newOrder[index], newOrder[swapIndex]] = [
        newOrder[swapIndex],
        newOrder[index],
      ];

      // Update order in backend
      onReorder(newOrder.map((f) => f._id));

      return newOrder;
    });
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
      <div>
        <p className="text-lg font-medium">{field.label}</p>
        <p className="text-sm text-gray-500">Type: {field.type}</p>
      </div>
      <div className="flex items-center gap-2">
        {index > 0 && (
          <button
            onClick={() => moveField("up")}
            className="bg-gray-300 p-2 rounded"
          >
            ⬆️
          </button>
        )}
        {index < totalFields - 1 && (
          <button
            onClick={() => moveField("down")}
            className="bg-gray-300 p-2 rounded"
          >
            ⬇️
          </button>
        )}
        <button
          onClick={() => onEdit(field)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(field._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FieldItem;
