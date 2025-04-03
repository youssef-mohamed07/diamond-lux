import React, { useState, useEffect } from "react";
import FormPreview from "../components/Form/FormPreview";
import ManageFields from "../components/Form/ManageFields";
import UnavailableDatesManager from "../components/Form/UnavailableDatesManager";
import { getFormFields } from "../api/formAPI";
import { Tab } from '@headlessui/react';

const FormSettings = () => {
  const [fields, setFields] = useState([]);

  // Fetch fields once in the parent component
  useEffect(() => {
    const fetchFields = async () => {
      const data = await getFormFields();
      setFields([...data].sort((a, b) => a.order - b.order)); // Ensure sorting
    };
    fetchFields();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-semibold mb-6">Form Settings</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-50 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white text-blue-700 shadow' 
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
            }`
          }>
            Form Fields
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white text-blue-700 shadow' 
              : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
            }`
          }>
            Unavailable Dates
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Form Fields Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side: Form Management Panel */}
              <div className="bg-white p-6 shadow-md rounded-lg w-full">
                <ManageFields fields={fields} setFields={setFields} />
              </div>

              {/* Right Side: Form Preview */}
              <div className="w-full">
                <FormPreview fields={fields} />
              </div>
            </div>
          </Tab.Panel>
          
          {/* Unavailable Dates Panel */}
          <Tab.Panel>
            <UnavailableDatesManager />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default FormSettings;
