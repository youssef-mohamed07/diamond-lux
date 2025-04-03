import { Form } from "../../../DB/models/form.schema.js";

// 1️⃣ Get the current form structure
export const getForm = async (req, res) => {
  try {
    let form = await Form.findOne();
    if (!form) {
      form = new Form({ fields: [] });
      await form.save();
    }

    // 🔥 Ensure sorting before sending response
    form.fields.sort((a, b) => a.order - b.order);

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 2️⃣ Add a new field
export const addField = async (req, res) => {
  try {
    const { label, name, type, options, required, defaultValue, order } =
      req.body;

    let form = await Form.findOne();
    if (!form) {
      form = new Form({ fields: [] });
    }

    // Check if `order` is provided, else assign next available order
    let newOrder = typeof order === "number" ? order : form.fields.length;

    // Ensure the order is unique by shifting existing fields if needed
    if (form.fields.some((field) => field.order === newOrder)) {
      form.fields.forEach((field) => {
        if (field.order >= newOrder) {
          field.order += 1; // Shift order to make room for new field
        }
      });
    }

    // Add the new field
    form.fields.push({
      label,
      name,
      type,
      options,
      required,
      defaultValue,
      order: newOrder, // Use the provided or auto-incremented order
    });

    // Sort fields by order before saving
    form.fields.sort((a, b) => a.order - b.order);

    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 3️⃣ Edit an existing field
export const editField = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Field ID is required" });

    const { label, type, options, required, defaultValue, order } = req.body;

    let form = await Form.findOne();
    if (!form) return res.status(404).json({ message: "Form not found" });

    const field = form.fields.id(id);
    if (!field)
      return res.status(404).json({ message: `Field not found: ${id}` });

    // Update field data
    field.label = label;
    field.type = type;
    field.options = options;
    field.required = required;
    field.defaultValue = defaultValue;
    field.order = order;

    await form.save();
    res.json({ message: "Field updated successfully", field });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 4️⃣ Remove a field
export const removeField = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

    let form = await Form.findOne();
    if (!form) return res.status(404).json({ message: "Form not found" });

    // Filter out the field with the matching _id
    const initialFieldCount = form.fields.length;
    form.fields = form.fields.filter((field) => field._id.toString() !== id);

    // Check if any field was removed
    if (form.fields.length === initialFieldCount) {
      return res.status(404).json({ message: "Field not found" });
    }

    await form.save();
    res.json({ message: "Field removed successfully", fields: form.fields });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 5️⃣ Reorder fields
export const reorderFields = async (req, res) => {
  try {
    const { newOrder } = req.body; // ✅ Expecting an array of `_id`s in the new order

    let form = await Form.findOne();
    if (!form) return res.status(404).json({ message: "Form not found" });

    // ✅ Assign new order values based on index in newOrder array
    form.fields.forEach((field) => {
      const newIndex = newOrder.indexOf(field._id.toString()); // Ensure matching _id
      if (newIndex !== -1) {
        field.order = newIndex; // ✅ Assign correct order value
      }
    });

    await form.save();
    res.json({ message: "Fields reordered successfully", fields: form.fields });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all unavailable dates
export const getUnavailableDates = async (req, res) => {
  try {
    let form = await Form.findOne();
    if (!form) {
      form = new Form({ fields: [], unavailableDates: [] });
      await form.save();
    }
    
    res.json({ unavailableDates: form.unavailableDates || [] });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new unavailable date
export const addUnavailableDate = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    
    let form = await Form.findOne();
    if (!form) {
      form = new Form({ fields: [], unavailableDates: [] });
    }
    
    const newDate = new Date(date);
    
    // Check if date already exists
    const dateExists = form.unavailableDates.some(d => 
      new Date(d).toISOString().split('T')[0] === newDate.toISOString().split('T')[0]
    );
    
    if (!dateExists) {
      form.unavailableDates.push(newDate);
      await form.save();
    }
    
    res.json({ 
      message: "Date added successfully", 
      unavailableDates: form.unavailableDates 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Remove an unavailable date
export const removeUnavailableDate = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    
    let form = await Form.findOne();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    const dateToRemove = new Date(date);
    
    // Filter out the date to remove
    form.unavailableDates = form.unavailableDates.filter(d => 
      new Date(d).toISOString().split('T')[0] !== dateToRemove.toISOString().split('T')[0]
    );
    
    await form.save();
    res.json({ 
      message: "Date removed successfully", 
      unavailableDates: form.unavailableDates 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
