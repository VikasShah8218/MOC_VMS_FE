import React, { useState, useEffect } from "react";
import { url } from "../../utils/Constants";
import Notification from "../../components/notification";
import defaultImage from "../../assets/images/no-data.png";
import "./style.js";

const ProfileCardRight = ({ visitorObj }) => (
  <div
    className={`p-4 flex flex-col items-center rounded-lg ${
      visitorObj.is_authorized === false ? "bg-red-500" : "bg-gray-200"
    } shadow overflow-hidden gap-2`}
  >
    <div className="w-full h-3/6 flex justify-center items-center overflow-hidden">
      <img
        className="border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: "200px", height: "200px" }}
        src={
          visitorObj.image
            ? `data:image/png;base64,${visitorObj.image}`
            : defaultImage
        }
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-full h-3/6 p-4 bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
      <div className="grid grid-cols-1 gap-3 items-center">
        <div>
          <label
            htmlFor="fullName"
            className="text-md font-semibold text-gray-800"
          >
            Full Name:{" "}
          </label>
          <span id="fullName" className="mt-2 text-lg text-blue-700">
            {visitorObj.first_name} {visitorObj.last_name}
          </span>
        </div>
        <div>
          <label htmlFor="zone" className="text-md font-semibold text-gray-800">
            Zone:{" "}
          </label>
          <span id="zone" className="mt-2 text-lg text-blue-700">
            {visitorObj.zone || "N/A"}
          </span>
        </div>
        <div>
          <label
            htmlFor="authorized"
            className="text-md font-semibold text-gray-800"
          >
            Authorized:{" "}
          </label>
          <span id="authorized" className="mt-2 text-lg text-blue-700">
            {visitorObj.is_authorized ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ProfileCardLeft = ({ visitorObj }) => (
  <div
    className={`p-4 flex flex-row items-center ${
      visitorObj.is_authorized === false ? "bg-red-500" : "bg-gray-200"
    } rounded-lg shadow overflow-hidden gap-4`}
  >
    <div className="w-4/6 h-96 flex justify-center items-center overflow-hidden">
      <img
        className="border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: "350px", height: "350px" }}
        src={
          visitorObj.image
            ? `data:image/png;base64,${visitorObj.image}`
            : defaultImage
        }
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-3/6 p-4 h-full bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
      <div className="grid grid-cols-1 gap-3 items-center">
        <div>
          <label
            htmlFor="fullName"
            className="text-md font-semibold text-gray-800"
          >
            Full Name:{" "}
          </label>
          <span id="fullName" className="mt-2 text-lg text-blue-700">
            {visitorObj.first_name} {visitorObj.last_name}
          </span>
        </div>
        <div>
          <label htmlFor="zone" className="text-md font-semibold text-gray-800">
            Zone:{" "}
          </label>
          <span id="zone" className="mt-2 text-lg text-blue-700">
            {visitorObj.zone || "N/A"}
          </span>
        </div>
        <div>
          <label
            htmlFor="authorized"
            className="text-md font-semibold text-gray-800"
          >
            Authorized:{" "}
          </label>
          <span id="authorized" className="mt-2 text-lg text-blue-700">
            {visitorObj.is_authorized ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const Guard = () => {
  const [visitors, setVisitors] = useState([]);
  const [visitorId, setVisitorId] = useState(20);

  const fetchVisitorData = async () => {
    try {
      const newVisitorResponse = await fetch(
        `${url}/visitor/visitor-info/${visitorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (newVisitorResponse.ok) {
        const newVisitor = await newVisitorResponse.json();
        setVisitors((prevVisitors) => {
          const updatedVisitors = [newVisitor, ...prevVisitors];

          // Ensure there are always 5 visitors in the array
          while (updatedVisitors.length < 5) {
            updatedVisitors.push(newVisitor); // Repeat last visitor if needed
          }

          return updatedVisitors.slice(0, 5); // Keep only 5 visitors
        });
      } else {
        const errorData = await newVisitorResponse.json();
        Notification.showErrorMessage("Error", errorData.error);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  useEffect(() => {
    fetchVisitorData();

    const interval = setInterval(() => {
      // Toggle visitorId between 20 and 21
      setVisitorId((prevId) => (prevId === 20 ? 21 : 20));
      fetchVisitorData();
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, [visitorId]);

  return (
    <div className="flex flex-col h-full" style={{ height: "95%" }}>
      <div className="flex flex-row p-3 gap-16 flex-grow overflow-hidden">
        <div className="w-3/5 grid grid-row-2 gap-4">
          {visitors.slice(0, 2).map((visitor, index) => (
            <ProfileCardLeft visitorObj={visitor} key={index} />
          ))}
        </div>
        <div className="w-3/5 grid grid-cols-2 gap-4">
          {visitors.slice(2).map((visitor, index) => (
            <ProfileCardRight visitorObj={visitor} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guard;
