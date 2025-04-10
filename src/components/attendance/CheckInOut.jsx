import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const CheckInOut = ({ isCheckedIn, employeeId, onSuccess }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', isSuccess: true });
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get location coordinates when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to access your location. Please enable location services.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);
  
  const handleCheckInOut = async () => {
    try {
      setIsProcessing(true);
      
      const endpoint = isCheckedIn ? '/api/attendance/checkout' : '/api/attendance/checkin';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId,
          timestamp: new Date().toISOString(),
          location: location || null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process request');
      }
      
      const data = await response.json();
      
      setModalContent({
        title: isCheckedIn ? 'Checked Out Successfully' : 'Checked In Successfully',
        message: isCheckedIn 
          ? `You have checked out at ${formatTime(currentTime)}. Have a great day!` 
          : `You have checked in at ${formatTime(currentTime)}. Welcome!`,
        isSuccess: true
      });
      
      setShowModal(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Check in/out error:', error);
      
      setModalContent({
        title: 'Operation Failed',
        message: error.message || 'An error occurred while processing your request.',
        isSuccess: false
      });
      
      setShowModal(true);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Clock size={20} className="text-gray-600 mr-2" />
          <div>
            <p className="text-sm text-gray-600">{formatDate(currentTime)}</p>
            <p className="text-xl font-semibold">{formatTime(currentTime)}</p>
          </div>
        </div>
        
        {location && (
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>Location Detected</span>
          </div>
        )}
      </div>
      
      {locationError && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700 flex items-center">
          <XCircle size={16} className="mr-2 text-yellow-500" />
          {locationError}
        </div>
      )}
      
      <Button
        variant={isCheckedIn ? "outline" : "primary"}
        className={`w-full py-3 ${isCheckedIn ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}`}
        disabled={isProcessing}
        onClick={handleCheckInOut}
        icon={isCheckedIn ? <LogOut size={18} /> : <LogIn size={18} />}
        label={isCheckedIn ? "Check Out" : "Check In"}
      />
      
      {isCheckedIn && (
        <p className="text-xs text-center mt-2 text-gray-500">
          You checked in at {isCheckedIn}
        </p>
      )}
      
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            {modalContent.isSuccess ? (
              <CheckCircle size={24} className="text-green-500 mr-2" />
            ) : (
              <XCircle size={24} className="text-red-500 mr-2" />
            )}
            <p>{modalContent.message}</p>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
              label="Close"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckInOut;