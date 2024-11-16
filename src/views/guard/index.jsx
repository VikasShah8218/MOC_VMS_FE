import React, { useState, useEffect, useRef } from "react";
import { url } from "../../utils/Constants.jsx";
import Notification from "../../components/notification/index.jsx";
import defaultVisitor from "../../assets/images/default.png";
import "./style.css";

const Guard = () => {
  const [visitors, setVisitors] = useState([{}, {}, {}, {}, {}]);
  const [visitorId, setVisitorId] = useState(20);
  const scanIn = useRef(null);

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
        Notification.showErrorMessage("Error", errorData.error);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  // useEffect(() => {
  //   fetchVisitorData();

  //   const interval = setInterval(() => {
  //     // Toggle visitorId between 20 and 21
  //     setVisitorId((prevId) => (prevId === 20 ? 21 : 20));
  //     fetchVisitorData();
  //   }, 2000); // Every second
  //   return () => clearInterval(interval);
  // }, [visitorId]);
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
    <div className="container">
      <input type="hidden" ref={scanIn} />
      {/* Main Visitor Box */}
      <div className="main-visitor">
        <img
          src={
            visitors[0].image
              ? `data:image/png;base64,${visitors[0].image}`
              : defaultVisitor
          }
          alt="Main Visitor"
          className="main-visitor-image"
        />
        <p className="main-visitor-title">Visitor 1</p>
      </div>

      {/* Small Visitor Boxes */}
      <div className="small-visitors">
        <div className="visitor-card">
          <img
            src={
              visitors[1].image
                ? `data:image/png;base64,${visitors[1].image}`
                : defaultVisitor
            }
            alt="Visitor"
            className="visitor-card-image"
          />
          <p className="visitor-title">Visitor</p>
        </div>
        <div className="visitor-card">
          <img
            src={
              visitors[2].image
                ? `data:image/png;base64,${visitors[2].image}`
                : defaultVisitor
            }
            alt="Visitor"
            className="visitor-card-image"
          />
          <p className="visitor-title">Visitor</p>
        </div>
        <div className="visitor-card">
          <img
            src={
              visitors[3].image
                ? `data:image/png;base64,${visitors[3].image}`
                : defaultVisitor
            }
            alt="Visitor"
            className="visitor-card-image"
          />
          <p className="visitor-title">Visitor</p>
        </div>
        <div className="visitor-card">
          <img
            src={
              visitors[4].image
                ? `data:image/png;base64,${visitors[4].image}`
                : defaultVisitor
            }
            alt="Visitor"
            className="visitor-card-image"
          />
          <p className="visitor-title">Visitor</p>
        </div>
      </div>
    </div>
  );
};

export default Guard;
