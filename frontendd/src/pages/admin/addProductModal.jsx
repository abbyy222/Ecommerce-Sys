
import React, { useState, useEffect } from 'react';

import { X, Plus, Save, Upload, ImageIcon } from "lucide-react";

const AddProductModal = ({ setShowAddModal, categories, handleCreateProduct,handleUpdateProduct, editingProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    stock: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
  });
useEffect(() => {
  if (editingProduct) {
    setFormData({
      name: editingProduct.name || '',
      description: editingProduct.description || '',
      category: editingProduct.category || '',
      costPrice: editingProduct.costPrice || '',
      sellingPrice: editingProduct.sellingPrice || '',
      stock: editingProduct.stock || '',
      sku: editingProduct.sku || ''
    });
  }
}, [editingProduct]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // handle text & number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert("Maximum of 5 images allowed.");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // remove a selected image
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // submit data to parent component
  const handleSubmit = (e) => {  
    e.preventDefault();

     if (editingProduct) {
    handleUpdateProduct(editingProduct._id, formData, imageFiles);
  } else {
    handleCreateProduct(formData, imageFiles);
  }
  };

  // reset everything when closing modal
  const handleClose = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setImageFiles([]);
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-3">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
               <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
            </h2>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-white font-semibold mb-3 block flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Product Images (Max 5)</span>
            </label>

            <div className="border-2 border-dashed border-white/40 rounded-2xl p-6 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-white/70 mb-3" />
                <p className="text-white font-semibold mb-1">Click to upload images</p>
                <p className="text-white/60 text-sm">PNG, JPG up to 5MB each</p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-xl border-2 border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORM INPUTS */}
          <div>
            <label className="text-white font-semibold mb-2 block">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="e.g., PROD-001"
              className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white focus:border-white focus:outline-none transition-all duration-300"
              >
                <option value="" className="bg-purple-600">Select category</option>
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat} className="bg-purple-600">
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Cost Price (₦) *</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Selling Price (₦) *</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter product description"
              className="w-full px-4 py-3 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/60 focus:border-white focus:outline-none transition-all duration-300 resize-none"
            ></textarea>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 mt-6 border-t border-white/30">
          <button
              type="button"
                onClick={handleSubmit}
                className="flex-1 bg-white text-purple-600 font-bold py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
             >
               <Save className="w-5 h-5" />
               <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/30 transition-all duration-300 border-2 border-white/40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
