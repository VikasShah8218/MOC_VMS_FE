import React, { useState, useEffect, useRef } from "react";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";
import defaultVisitor from "../../assets/images/default.png";
import "./style.css";
import "./Popup.css";
// const katrina = defaultVisitor = "data:image/png;base64,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"

const Guard = () => {
  const [visitors, setVisitors] = useState([{}, {}, {}, {}, {}]);
  const [visitorId, setVisitorId] = useState(20);
  const [isVisible, setIsVisible] = useState(false);
  const scanIn = useRef(null);

  const showPopup = () => {
    setIsVisible(true); // Show the popup
    // Auto-close the popup after 3 seconds
    setTimeout(() => {
      closePopup();
    }, 2000);
  };

  const closePopup = () => {
    setIsVisible(false); // Hide the popup
  };

  function addAndShift(newObject) {
    if (newObject && newObject.id) {
      setVisitors((prevData) => {
        const newData = [...prevData];
        newData.unshift(newObject);
        newData.pop();
        return newData;
      });
    }
  }

  const fetchVisitorData = async (passNumber) => {
    try {
      const newVisitorResponse = await fetch(`${url}/visitor/access-gate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pass_number: passNumber }),
      });

      if (newVisitorResponse.ok) {
        const newVisitor = await newVisitorResponse.json();
        addAndShift(newVisitor);
      } else {
        const errorData = await newVisitorResponse.json();
        // Notification.showErrorMessage("Error", errorData.detail);
        showPopup();
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const temp = scanIn.current.value;
      scanIn.current.value = "";
      console.log("==>", temp);
      fetchVisitorData(temp);
    } else {
      if (/^[0-9]$/.test(event.key)) {
        scanIn.current.value += event.key;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
    <div className="visitor-container">

      <div className="main-visitor">
        <img src={visitors[0].image ? `data:image/png;base64,${visitors[0].image}`: defaultVisitor} alt="Main Visitor" className="main-visitor-image" />
        <p className="main-visitor-title">Visitor 1</p>
      </div>

      <div className="small-visitors">
        <div className="small-v-1">
          <div className="visitor-card">
            <div className="visitor-image-box">
              <img src={visitors[1].image ? `data:image/png;base64,${visitors[1].image}`: defaultVisitor}alt="Visitor" className="visitor-card-image" />
            </div>
            
            <div className="visitor-detail">
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
            </div>
          </div>
          <div className="visitor-card">
            <div className="visitor-image-box">
              <img src={visitors[2].image ? `data:image/png;base64,${visitors[2].image}`  : defaultVisitor } alt="Visitor" className="visitor-card-image" />
            </div>
            
            <div className="visitor-detail">
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
            </div>
          </div>
        </div>

        <div className="small-v-1">
          <div className="visitor-card">
            <div className="visitor-image-box">
              <img src={visitors[3].image? `data:image/png;base64,${visitors[3].image}`: defaultVisitor} alt="Visitor" className="visitor-card-image" />
            </div>
            
            <div className="visitor-detail">
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
            </div>
          </div>

          <div className="visitor-card">
            <div className="visitor-image-box">
              <img src={visitors[4].image? `data:image/png;base64,${visitors[4].image}` : defaultVisitor} alt="Visitor"className="visitor-card-image"/>
            </div>
            
            <div className="visitor-detail">
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
              <p className="visitor-title">Visitor</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input type="hidden" ref={scanIn} />
     <div className="popup-container">
     {/* Button to trigger the popup */}
     {/* <button onClick={showPopup}>Trigger Access Denied</button> */}

     {/* Popup */}
     {isVisible && (
       <div className={`popup ${isVisible ? "show" : "hide"}`}>
         <p className="popup-message">! Access</p>
         <p className="popup-message">Denied</p>
         {/* <button onClick={closePopup}>Close</button> */}
       </div>
     )}
   </div>
   </>
  );
};

export default Guard;
