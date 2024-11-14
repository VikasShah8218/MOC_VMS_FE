import React, { useState, useEffect, useRef } from 'react';
import test from "../../assets/images/no-data.png";
import Notification from "../../components/notification";
import defaultImage from "../../assets/images/no-data.png";
import useWebSocket, { ReadyState } from "react-use-websocket"


const ProfileCardRight = ({ visitorObj }) => (
  <div className={`p-4 flex flex-col items-center rounded-lg ${visitorObj.is_authorized===false ? 'bg-red-500' : 'bg-gray-200'} shadow overflow-hidden gap-2`}>
    <div className="w-full h-3/6 flex justify-center items-center overflow-hidden">
      <img
        className="  border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: '200px', height: '200px' }}
        src={"data:image/png;base64,"+(visitorObj.image)  || defaultImage}
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-full h-3/6 p-4 bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
    {visitorObj.first_name ? (
        <>
          <div className="grid grid-cols-1 gap-3 items-center">
            <div>
              <label htmlFor="fullName" className="text-md font-semibold text-gray-800">Full Name: </label>
              <span id="fullName" className="mt-2 text-lg text-blue-700"> {visitorObj.first_name} {visitorObj.last_name}</span>
            </div>
            <div>
              <label htmlFor="govIdType" className="text-md font-semibold text-gray-800">Zone: </label>
              <span id="govIdType" className="mt-2 text-lg text-blue-700"> {visitorObj.zone	}</span>
            </div>
            <div>
              <label htmlFor="govIdNo" className="text-md font-semibold text-gray-800">Authorized: </label>
              <span id="govIdNo" className="mt-2 text-lg text-blue-700"> {visitorObj.is_authorized ? "Yes" : "No"}</span>
            </div>

            <div>
              <label htmlFor="visitorType" className="text-md font-semibold text-gray-800">Visitor Type: </label>
              <span id="visitorType" className="mt-2 text-lg text-blue-700"> {visitorObj.visitor_type}</span>
            </div>
            <div>
              <label htmlFor="reader" className="text-md font-semibold text-gray-800">Reader: </label>
              <span id="reader" className="mt-2 text-lg text-blue-700"> {visitorObj.reader}</span>
            </div>
          </div>
        </>
      ) : (
        // <h1>No Data Available!</h1>
        <h1 className="text-2xl font-semibold text-gray-800">No Data Available!</h1>
      )}
    </div>
  </div>
);

const ProfileCardLeft = ({ visitorObj }) => (
  <div className={`p-4 flex flex-row items-center ${visitorObj.is_authorized===false ? 'bg-red-500' : 'bg-gray-200'} rounded-lg shadow overflow-hidden gap-4`}>
    <div className="w-4/6 h-96 flex justify-center items-center overflow-hidden">
      <img
        className="  border-4 p-1 border-gray-300 bg-gray-100 object-cover"
        style={{ width: '350px', height: '350px' }}
        src={"data:image/png;base64,"+(visitorObj.image) || defaultImage}
        alt={visitorObj.first_name}
      />
    </div>
    <div className="w-3/6 p-4 h-full bg-gray-300 items-center justify-center rounded-lg overflow-y-auto">
      {visitorObj.first_name ? (
        <>
          <div className="grid grid-cols-1 gap-3 items-center">
            <div>
              <label htmlFor="fullName" className="text-md font-semibold text-gray-800">Full Name: </label>
              <span id="fullName" className="mt-2 text-lg text-blue-700"> {visitorObj.first_name} {visitorObj.last_name}</span>
            </div>
            <div>
              <label htmlFor="govIdType" className="text-md font-semibold text-gray-800">Zone: </label>
              <span id="govIdType" className="mt-2 text-lg text-blue-700"> {visitorObj.zone	}</span>
            </div>
            <div>
              <label htmlFor="govIdNo" className="text-md font-semibold text-gray-800">Authorized: </label>
              <span id="govIdNo" className="mt-2 text-lg text-blue-700"> {visitorObj.is_authorized ? "Yes" : "No"}</span>
            </div>

            <div>
              <label htmlFor="visitorType" className="text-md font-semibold text-gray-800">Visitor Type: </label>
              <span id="visitorType" className="mt-2 text-lg text-blue-700"> {visitorObj.visitor_type}</span>
            </div>
            <div>
              <label htmlFor="reader" className="text-md font-semibold text-gray-800">Reader: </label>
              <span id="reader" className="mt-2 text-lg text-blue-700"> {visitorObj.reader}</span>
            </div>
          </div>
        </>
      ) : (
        // <h1>No Data Available!</h1>
        <h1 className="text-2xl font-semibold text-gray-800">No Data Available!</h1>
      )}
    </div>
  </div>
);

const Guard = () => {
  const placeholderData = new Array(6).fill({
    imageUrl: test,
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    admin: true,
  });
  

  // const WS_URL = "wss://192.168.1.54/ws/data/" // For running in remote server
  const WS_URL = "ws://127.0.0.1:8000/ws/data/" // For running in local server
  const [profiles, setProfiles] = useState(placeholderData);

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      protocols: [token],
      share: false,
      shouldReconnect: () => false,
      onOpen: () => console.log('opened'),
    },
  )
  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed", readyState);

  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`)
    console.log(lastJsonMessage);
    if (lastJsonMessage) {
      if (lastJsonMessage.response.success) {
        setProfiles([lastJsonMessage.response.success, ...profiles.slice(0, -1)]);
      } else if (lastJsonMessage.response.reader_type==='gate_entry') {
        if (lastJsonMessage.response.error==='Pass Invalid') {
          Notification.showCenterModal("Error", lastJsonMessage.response.error, lastJsonMessage.response.visitor, 5000);
        } else {
          Notification.showErrorMessage("Error", lastJsonMessage.response.error, 5000);
        }
      } else {
        setProfiles([lastJsonMessage.response.visitor, ...profiles.slice(0, -1)]);
        if (lastJsonMessage.response.error==='Pass Invalid' && lastJsonMessage.response.visitor.is_blacklisted) {
          Notification.showCenterModal("Error", lastJsonMessage.response.error, lastJsonMessage.response.visitor, 5000);
        } else if (lastJsonMessage.response.error!=='Pass Invalid') {
          Notification.showErrorMessage("Error", lastJsonMessage.response.error, 5000);
        }
      }
    }
  }, [lastJsonMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  
  return (
    <div  className="flex flex-col h-full" style={{height:"95%"}}>
      <div className="flex justify-center items-center">
        <div
          className={`h-1 w-screen rounded-lg ${
            connectionStatus==='Open' ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>
      <div className="flex flex-row p-3 gap-16 flex-grow overflow-hidden">
        <div className="w-3/5 grid grid-row-2 gap-4">
          {profiles.slice(0, 2).map((profile, index) => (
            <ProfileCardLeft visitorObj={profile} key={index} />
          ))}
        </div>
        <div className="w-3/5 grid grid-cols-2 gap-4">
          {profiles.slice(2).map((profile, index) => (
            <ProfileCardRight visitorObj={profile} key={index} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Guard;

