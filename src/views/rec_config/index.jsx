import React, { useState, useEffect } from "react";
import './RecConfig.css';

const RecConfig = () => {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);

  const [name1, setName1] = useState("");
  const [names1, setNames1] = useState([]);

  useEffect(() => {
    const storedNames = JSON.parse(localStorage.getItem("names")) || [];
    setNames(storedNames);
  }, []);

  useEffect(() => {
    const storedNames = JSON.parse(localStorage.getItem("names1")) || [];
    setNames1(storedNames);
  }, []);

  const addName = () => {
    if (name.trim()) {
      const updatedNames = [...names, name.trim()];
      setNames(updatedNames);
      localStorage.setItem("names", JSON.stringify(updatedNames));
      setName("");
    }
  };

  const addName1 = () => {
    if (name1.trim()) {
      const updatedNames = [...names1, name1.trim()];
      setNames1(updatedNames);
      localStorage.setItem("names1", JSON.stringify(updatedNames));
      setName1("");
    }
  };

  const removeName = (nameToRemove) => {
    const updatedNames = names.filter(name => name !== nameToRemove);
    setNames(updatedNames);
    localStorage.setItem("names", JSON.stringify(updatedNames));
  };
  const removeName1 = (nameToRemove) => {
    const updatedNames = names1.filter(name => name !== nameToRemove);
    setNames1(updatedNames);
    localStorage.setItem("names1", JSON.stringify(updatedNames));
  };

  return (
    <>
    <div className="shah-l">
      <div className="container" style={{width:"min-content"}}>  
        <div className="input-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Whome to Visit"
            className="input"
          />
          <button onClick={addName} className="button">Add Name</button>
        </div>
        <div className="name-list">
          {names.map((name, index) => (
            <div key={index} className="name-item">
              {name}
              <button className="remove-button" onClick={() => removeName(name)}>✖</button>
            </div>
          ))}
        </div>
      </div>
          
      <div className="container" style={{width:"min-content"}}>  
        <div className="input-group">
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Visiting Purpose"
            className="input"
          />
          <button onClick={addName1} className="button">Add Name</button>
        </div>
        <div className="name-list">
          {names1.map((name, index) => (
            <div key={index} className="name-item">
              {name}
              <button className="remove-button" onClick={() => removeName1(name)}>✖</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default RecConfig;
