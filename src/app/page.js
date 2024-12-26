/**
 * Instax Filter
 * A web application that transforms digital photos into Instax-style instant photos.
 * Features:
 * - Supports both Instax Mini and Wide formats
 * - Adds classic Instax frame
 * - Allows text and date customization
 * - Provides high-quality image download
 * 
 * @author: Adit Gupta
 * @version: 1.0.0
 * @license: MIT
 */

"use client";

import React, { useState } from 'react';

/**
* lucide-react - Provides modern UI icons
* Camera - Header icon for the app
* Upload - Icon for file upload section
*/

import { Camera, Upload } from 'lucide-react';

/**
* html2canvas - Captures DOM elements as images
* Used for downloading the styled Instax frame with all effects and text
*/

import html2canvas from 'html2canvas';

const InstaxFilter = () => {
  // State management for image, format, text, and error handling
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [format, setFormat] = useState('mini');
  const [photoText, setPhotoText] = useState('');
  const [photoDate, setPhotoDate] = useState('');

  /**
   * Handles image file upload
   * Supports regular image formats and HEIC
   * Converts uploaded file to base64 for display
   */
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (file) {
      if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic')) {
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result);
          };
          reader.onerror = () => {
            setError('Failed to read the image file.');
          };
          reader.readAsDataURL(file);
        } catch (err) {
          setError('Failed to process the image.');
          console.error('Image processing error:', err);
        }
      } else {
        setError('Please upload an image file (including .heic).');
      }
    }
  };

  /**
   * Handles text input with character limit
   * Maximum 50 characters allowed
   */
  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 50) {
      setPhotoText(text);
    }
  };

  /**
   * Formats date input into "MMM DD, YYYY" format
   * Example: "Dec 24, 2024"
   */
  const handleDateChange = (e) => {
    const date = e.target.value;
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      setPhotoDate(formattedDate);
    } else {
      setPhotoDate('');
    }
  };

  /**
   * Captures the styled frame and downloads as PNG
   * Uses html2canvas for high-quality capture
   * Maintains aspect ratio and applies correct scaling
   */
  const captureFrame = async () => {
    const frameRef = document.querySelector('.instax-frame');
    if (!frameRef) return;
    
    try {
      const canvas = await html2canvas(frameRef, {
        scale: 4,
        backgroundColor: 'transparent',
        logging: false,
        useCORS: true,
        imageTimeout: 0,
        windowWidth: frameRef.offsetWidth,
        windowHeight: frameRef.offsetHeight,
        x: 0,
        y: 0,
        width: frameRef.offsetWidth,
        height: frameRef.offsetHeight
      });
      
      const link = document.createElement('a');
      link.download = `instax-${format}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      setError('Failed to save image');
      console.error('Save error:', err);
    }
  };

  /**
   * Calculates frame dimensions based on format
   * Mini: 54:86 aspect ratio
   * Wide: 99:62 aspect ratio
   */
  const getFrameStyles = () => {
    const baseWidth = format === 'wide' ? 400 : 320;
    const aspectRatio = format === 'wide' ? '99/62' : '54/86';
    
    return {
      frameWidth: baseWidth,
      aspectRatio,
      stripHeight: format === 'wide' ? '48' : '40'
    };
  };

  const styles = getFrameStyles();

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Header with title and format selection */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Camera className="w-6 h-6" />
            Instax Filter
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('mini')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                format === 'mini'
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Instax Mini
            </button>
            <button
              onClick={() => setFormat('wide')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                format === 'wide'
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Instax Wide
            </button>
          </div>
        </div>

        {/* Privacy notice */}
        <p className="text-gray-400 text-xs mt-2 mb-6 text-center">
          Images exist only in browser memory and are cleared on page refresh/close.
        </p>

        <div className="space-y-4">
          {/* Image upload section */}
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*,.heic"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-400">Upload your photo (including .heic)</span>
            </div>
          </label>

          {/* Text input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Photo Text ({50 - photoText.length} chars left)
            </label>
            <input
              type="text"
              value={photoText}
              onChange={handleTextChange}
              maxLength={50}
              placeholder="Add a caption..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Photo Date
            </label>
            <input
              type="date"
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          {/* Instax frame display */}
          {selectedImage && (
            <div className="relative mx-auto" style={{ width: `${styles.frameWidth}px` }}>
              <div className="relative bg-white p-4 rounded-lg shadow-xl instax-frame">
                <div 
                  className="relative overflow-hidden"
                  style={{ aspectRatio: styles.aspectRatio }}
                >
                  {/* Image with filters */}
                  <div className="absolute inset-0 px-2 pt-4 pb-2">
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded"
                      style={{
                        filter: 'contrast(1.1) saturate(1.2) brightness(1.1)',
                        mixBlendMode: 'multiply'
                      }}
                      crossOrigin="anonymous"
                    />
                  </div>
                  {/* Light reflection effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  {/* Frame border */}
                  <div className="absolute inset-0 border-8 border-white rounded" />
                </div>
                {/* Development strip */}
                <div 
                  className="bg-white mt-2 rounded"
                  style={{ height: `${styles.stripHeight}px` }}
                >
                  <div className="flex flex-col items-center justify-center h-full pb-3">
                    <div className="text-center">
                      <span className="text-gray-800 text-sm font-light">
                        {photoText}
                      </span>
                    </div>
                    <div className="text-center mt-0.5">
                      <span className="text-gray-600 text-xs">
                        {photoDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Download button */}
              <button 
                onClick={captureFrame}
                className="w-full mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              >
                Save Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstaxFilter;