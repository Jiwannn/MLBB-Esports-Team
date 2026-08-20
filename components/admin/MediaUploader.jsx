import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'mlbb_uploads');
        
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        
        setUploadedFiles(prev => [...prev, {
          url: response.data.secure_url,
          name: file.name,
          size: file.size,
        }]);
        
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm']
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold gold-text mb-6">Media Uploader</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-yellow-500 bg-yellow-500/10' 
            : 'border-gray-700 hover:border-yellow-500/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl"
          >
            📁
          </motion.div>
          <div>
            <p className="text-lg silver-text">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              or click to select files
            </p>
          </div>
          {uploading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold silver-text mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-lg overflow-hidden group"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-400 truncate">{file.name}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="flex-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30"
                    >
                      Copy URL
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 text-center"
                    >
                      View
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}