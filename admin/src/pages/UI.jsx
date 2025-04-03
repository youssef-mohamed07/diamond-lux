import React, { useEffect, useState } from "react";
import { getUI, createUI, updateUI } from "../api/UIApi";
import { toast } from "react-toastify";
import 'froala-editor/js/plugins.pkgd.min.js'; 
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css'; 
import { lazy, Suspense } from "react";

const FroalaEditor = lazy(() => import("react-froala-wysiwyg"));


function UI() {
  const [logoImage, setLogoImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    logoImage: "",
    footer: {
      description: "",
    },
  });

   const config = {
    key : "AZdksUMuR2CArgS8xFhATz",
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarInline: false,
    attribution: false,
  };

  useEffect(() => {
    getUI().then((data) => {
      if (data) {
        setLogoImage(data.logoImage);
        setDescription(data.footer?.description || "");
        setFormData({
          id: data._id,
          logoImage: data.logoImage,
          footer: {
            description: data.footer?.description || "",
          },
        });
      }
    });
  }, []);

  const sanitizeContent = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove the "Powered by Froala Editor" paragraph
    div.querySelectorAll('p[data-f-id="pbf"]').forEach((el) => el.remove());

    return div.innerHTML;
  };

  const handleDescriptionChange = (newContent) => {
    const sanitizedContent = sanitizeContent(newContent);
    setDescription(sanitizedContent);
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        description: sanitizedContent,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      if (!imageFile && !formData.id) {
        toast.error("Please select a logo image");
        setIsLoading(false);
        return;
      }

      if (imageFile) {
        formDataToSend.append("logoImage", imageFile);
      }

      formDataToSend.append("footer[description]", description || "");

      if (formData.id) {
        await updateUI(formData.id, formDataToSend);
      } else {
        await createUI(formDataToSend);
      }

      toast.success("Changes saved successfully!");

      const updatedData = await getUI();
      if (updatedData) {
        setLogoImage(updatedData.logoImage);
        setDescription(updatedData.footer?.description || "");
        setFormData({
          id: updatedData._id,
          logoImage: updatedData.logoImage,
          footer: {
            description: updatedData.footer?.description || "",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Error saving changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .fr-box .fr-quick-insert {
            display: none !important;
          }
        `}
      </style>
      <form
        onSubmit={handleSubmit}
        className="p-4 md:p-6 w-full max-w-2xl mx-auto space-y-8"
      >
        <h2 className="text-xl font-bold mb-6">General UI Settings</h2>

        <div className="space-y-6">
          <div>
            <div className="w-full sm:w-[60%] md:w-[50%]">
              <label className="block mb-3 text-lg font-medium">
                Logo Image
                <span className="ml-2 text-sm text-gray-500">
                  (Click to upload)
                </span>
              </label>
              <label htmlFor="image2" className="cursor-pointer block">
                <img
                  className="w-full aspect-video object-contain p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                  src={logoImage}
                  alt="Logo Image"
                />
                <input
                  type="file"
                  id="image2"
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-lg font-medium">
                  Footer Description
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
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}

export default UI;
