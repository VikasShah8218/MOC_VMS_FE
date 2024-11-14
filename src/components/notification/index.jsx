import { Store } from "react-notifications-component";
import React, { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BadgeIcon from '@mui/icons-material/Badge';
import BlockIcon from '@mui/icons-material/Block';

const showErrorMessage = (title, message, duration=2000) => {
  Store.addNotification({
    title: title,
    message: message,
    type: "danger",
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: duration,
      onScreen: true,
      showIcon: true,
    },
  });
};

const showSuccessMessage = (title, message) => {
  Store.addNotification({
    title: title,
    message: message,
    type: "success",
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true,
      showIcon: true,
    },
  });
};

const VisitorNotificationContent = ({ visitor, message, duration, onClose=()=>{} }) => {
  console.log(":::visitooooooooor", message);
  
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const bits = 50;
  const decrementPerSecond = 100 / (duration / bits);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev > 0) return prev - decrementPerSecond;
        clearInterval(interval); // Clear interval once progress reaches 0 or goes below
        return 0;
      });
    }, bits);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Callback to parent component to inform about the close event
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, decrementPerSecond]);

  if (!isVisible) return null;

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Paper className="p-6 rounded-lg shadow text-white border-gray-300">
        <div className="text-center bg-red-300 border-2 border-gray-300 p-10 rounded-lg shadow-sm">
          <div className="relative">
            <div className="flex justify-center mb-4 mt-2">
              <div className="inline-block h-24 w-24 border-2 border-gray-300 rounded-full overflow-hidden bg-gray-200">
                {visitor.image ? (
                  <img src={`data:image/jpeg;base64,${visitor.image}`} alt="User" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white font-bold bg-customGreen">
                    {visitor.first_name ? visitor.first_name.charAt(0) : 'N'}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" p-1 rounded-lg shadow-sm">
            <div className="mb-2 font-bold text-3xl text-blue-600">
              {`${visitor.first_name} ${visitor.last_name}`}
            </div>
            <div className="mb-2 font-bold text-5xl text-red-800">
              {`${message}`}
            </div>
            <div className="divide-y divide-gray-300">
              <InfoItem icon={<PersonIcon color="primary" />} label={("Visitor Type")} value={visitor.visitor_type} />
              <InfoItem icon={<PhoneIcon color="action" />} label={("Phone No")} value={visitor.phone} />
              <InfoItem icon={<BadgeIcon color="info" />} label={("Gov ID Type")} value={visitor.gov_id_type.replace('_', ' ')} />
              <InfoItem icon={<VpnKeyIcon color="primary" />} label={("Gov ID No")} value={visitor.gov_id_no} />
              {visitor.is_blacklisted ? <InfoItem icon={<BlockIcon color={visitor.is_blacklisted ? 'error' : 'success'} />} label={("Reason")} value={visitor.other} /> : null}
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 relative">
          <div className="bg-red-500 h-2" style={{ width: `${progress}%` }}></div>
        </div>
      </Paper>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="py-2 flex items-center">
    {icon}
    <span className="ml-1 font-bold">{label}</span>
    <span className="ml-1">:</span>
    <span className="ml-2">{value}</span>
  </div>
);

const showCenterModal = (title, message, visitor, duration=5000) => {

  // console.log(":::duration", duration, viewModalOpen);
  Store.addNotification({
    title: title || "Important Message!",
    message: message || "This is your message to the user.",
    type: "info", // 'default', 'success', 'info', 'warning', 'danger'
    container: "center",
    animationIn: ["animate__animated", "animate__fadeIn"], // Ensure correct class names
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: duration, // duration the notification stays
      onScreen: true, // keep the notification on screen
      pauseOnHover: true,
      showIcon: true
    },
    // content: visitor
    content: (
      <VisitorNotificationContent 
        visitor={visitor}
        message={message}
        duration={duration}
      />
    ),
    width: 600,
  });
}

const Notification = {
  showErrorMessage,
  showSuccessMessage,
  showCenterModal,
};

export default Notification;
