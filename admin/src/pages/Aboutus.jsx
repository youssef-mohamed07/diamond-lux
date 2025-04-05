import { useState, useEffect } from "react";
import { getAboutData, updateAboutData } from "../api/aboutApi"; // You'll need to create this in admin
import { toast } from "react-toastify"; // Add this if you're using react-toastify for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import { lazy, Suspense } from "react";

const FroalaEditor = lazy(() => import("react-froala-wysiwyg"));

export default function Aboutus() {
  const [formData, setFormData] = useState({
    intro: "",
    journey: "",
    mission: "",
    whyChoose: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
    ],
  });

  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);

  const config = {
    key: "AZdksUMuR2CArgS8xFhATz",
    placeholderText: "Edit Your Content Here!",
    charCounterCount: false,
    toolbarInline: false,
    attribution: false,
  };

  const sanitizeContent = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove the "Powered by Froala Editor" paragraph
    div.querySelectorAll('p[data-f-id="pbf"]').forEach((el) => el.remove());

    return div.innerHTML;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAboutData();
        if (response) {
          setFormData(response);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  const handleWhyChooseChange = (index, field, value) => {
    const updatedWhyChoose = [...formData.whyChoose];
    updatedWhyChoose[index] = {
      ...updatedWhyChoose[index],
      [field]: value,
    };
    setFormData({ ...formData, whyChoose: updatedWhyChoose });
  };

  const validateForm = () => {
    // Check main fields
    if (!formData.intro.trim()) return "Intro field is required";
    if (!formData.journey.trim()) return "Journey field is required";
    if (!formData.mission.trim()) return "Mission field is required";

    // Check Why Choose Us sections
    for (let i = 0; i < formData.whyChoose.length; i++) {
      const item = formData.whyChoose[i];
      if (!item.title.trim())
        return `Title is required in Why Choose Us section ${i + 1}`;
      if (!item.text.trim())
        return `Text is required in Why Choose Us section ${i + 1}`;
    }

    return null; // Return null if validation passes
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("intro", sanitizeContent(formData.intro)); // Sanitize intro
      formDataToSend.append("journey", formData.journey);
      formDataToSend.append("mission", formData.mission);
      formDataToSend.append("whyChoose", JSON.stringify(formData.whyChoose));
      if (image) {
        formDataToSend.append("image", image);
      }

      await updateAboutData(formDataToSend);
      toast.success("About page updated successfully!");
    } catch (error) {
      console.error("Error updating about data:", error);
      toast.error("Failed to update about page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit About Us Page</h2>

      <div className="space-y-4">
        {/* Image placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-sm">Image Upload Section</p>
          <input type="file" onChange={handleImageChange} className="w-full" />
        </div>

        {/* Text fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intro
            </label>
            <Suspense fallback={<div>Loading editor...</div>}>
              <FroalaEditor
                tag="textarea"
                config={config}
                model={description || ""}
                onModelChange={setDescription}
              />
            </Suspense>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Journey
            </label>
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              rows="3"
              value={formData.journey}
              onChange={(e) =>
                setFormData({ ...formData, journey: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission
            </label>
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              rows="3"
              value={formData.mission}
              onChange={(e) =>
                setFormData({ ...formData, mission: e.target.value })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why Choose Us
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              {formData.whyChoose.map((item, index) => (
                <div key={index} className="border rounded-md p-2">
                  <input
                    type="text"
                    className="w-full p-1.5 border rounded-md mb-1.5 text-sm"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) =>
                      handleWhyChooseChange(index, "title", e.target.value)
                    }
                  />
                  <textarea
                    className="w-full p-1.5 border rounded-md text-sm"
                    rows="2"
                    placeholder="Text"
                    value={item.text}
                    onChange={(e) =>
                      handleWhyChooseChange(index, "text", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="w-full sm:w-auto px-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-blue-400"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
