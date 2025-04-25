import React from "react";
// import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";


function InputBox({formData,setFromData,inputName,inputStateName,icon:Icon,placeholder,inputType}) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
        {inputName}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {
          Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        }
        <input
          id="name"
          type={inputType}
          required
          step={'0.01'}
          value={formData[inputStateName]}
          onChange={(e) => setFromData({ ...formData, [inputStateName]: e.target.value })}
          className={`block w-full px-3 py-2  bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${ Icon ?  'pl-10' : ''}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default InputBox;
