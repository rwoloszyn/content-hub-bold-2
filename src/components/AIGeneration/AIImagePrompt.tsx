import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  X, 
  Plus, 
  Info, 
  Camera, 
  RefreshCw 
} from 'lucide-react';
import { AI_MODELS } from '../../services/aiService';

interface AIImagePromptProps {
  onImageUpload: (images: string[]) => void;
  selectedModel: string;
  isGenerating: boolean;
}

export function AIImagePrompt({ 
  onImageUpload, 
  selectedModel, 
  isGenerating 
}: AIImagePromptProps) {
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const supportsImages = AI_MODELS[selectedModel]?.supportsImages || false;
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = (files: File[]) => {
    // Filter for image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Create object URLs for the images
    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
    
    // Update state and notify parent
    const newImages = [...images, ...imageUrls];
    setImages(newImages);
    onImageUpload(newImages);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newImages[index]);
    
    // Remove the image from the array
    newImages.splice(index, 1);
    setImages(newImages);
    onImageUpload(newImages);
  };
  
  if (!supportsImages) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">
              The selected model ({AI_MODELS[selectedModel]?.name}) doesn't support image inputs. 
              Switch to a model like Gemini Pro Vision to use images.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Add Images (Optional)
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/4 images
        </span>
      </div>
      
      {/* Drag and drop area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {images.length === 0 ? (
          <div className="text-center py-6">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Drag and drop images here</p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={isGenerating}
            />
            <label
              htmlFor="image-upload"
              className={`inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer transition-colors ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Browse Images
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={isGenerating}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <input
                    type="file"
                    id="add-image"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isGenerating}
                  />
                  <label
                    htmlFor="add-image"
                    className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
                      isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Plus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Images will be processed by the AI model to enhance content generation.</p>
            </div>
          </div>
        )}
      </div>
      
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p>The AI will analyze these images and incorporate relevant details into the generated content.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}