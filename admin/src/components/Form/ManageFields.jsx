import React, { useState } from "react";
import FieldItem from "./FieldItem";
import FieldForm from "./FieldForm";
import {
  addFormField,
  updateFormField,
  deleteFormField,
  reorderFormFields,
} from "../../api/formAPI";

const ManageFields = ({ fields, setFields }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleEdit = (field) => {
    setEditingField(field);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFormField(id);
      setFields((prevFields) => prevFields.filter((field) => field._id !== id));
    } catch (error) {
      console.error("Failed to delete field", error);
    }
  };

  const handleSaveField = async (fieldData) => {
    try {
      if (editingField && editingField._id) {
        const updatedField = await updateFormField(editingField._id, fieldData);

        setFields((prevFields) =>
          prevFields.map((f) =>
            f._id === editingField._id ? { ...updatedField, _id: f._id } : f
          )
        ); // ✅ Ensures `_id` is not lost
      } else {
        const newField = await addFormField(fieldData);
        setFields((prevFields) => [...prevFields, newField]);
      }
      setIsAdding(false);
      setEditingField(null);

      window.location.reload();
    } catch (error) {
      console.error("Failed to save field", error);
    }
  };

  const handleReorder = async (newOrder) => {
    try {
      const updatedFields = await reorderFormFields(newOrder);

      setFields(updatedFields.fields); // ✅ Set fields from backend response
      window.location.reload();
    } catch (error) {
      console.error("Failed to reorder fields", error);
    }
  };

  const handleAddNewField = () => {
    setEditingField(null); // ✅ Clear editing state
    setIsAdding(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Manage Form Fields</h2>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handleAddNewField}
        >
          + Add New Field
        </button>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-gray-500">No fields added yet.</p>
        ) : (
          fields.map((field, index) => (
            <FieldItem
              key={field._id || index} // ✅ Fallback to `index` if `_id` is missing
              field={field}
              index={index}
              totalFields={fields.length}
              onEdit={handleEdit}
              onDelete={handleDelete}
              setFields={setFields}
              onReorder={handleReorder}
            />
          ))
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <FieldForm
          field={editingField}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveField}
        />
      )}
    </div>
  );
};

export default ManageFields;
