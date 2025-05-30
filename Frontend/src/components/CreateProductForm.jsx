import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import InputBox from "./inputBox";
import {  userProductStore } from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];
function CreateProductForm() {
  const [formData, setFromData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { loading, createProducts } = userProductStore();

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    
    
    try {
     await createProducts(formData);
    setFromData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: ""
    });
    } catch (error) {
     console.log('Error in Create Product Method :' , error.message)
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFromData({ ...formData, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300 ">
        Create New Product
      </h2>
      <form onSubmit={()=>handleSubmit(event)} className="space-y-4">
        <InputBox
          formData={formData}
          setFromData={setFromData}
          inputName={"Product Name"}
          inputStateName={"name"}
          icon={false}
          placeholder={""}
          inputType={"text"}
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFromData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          ></textarea>
        </div>

        <InputBox
          formData={formData}
          setFromData={setFromData}
          inputName={"Price"}
          inputStateName={"price"}
          icon={false}
          placeholder={""}
          inputType={"number"}
        />

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>

          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFromData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="" hidden>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {formData.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rouded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loding......
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default CreateProductForm;
