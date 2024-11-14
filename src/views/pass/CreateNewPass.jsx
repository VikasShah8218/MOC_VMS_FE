import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Notification from '../../components/notification';
import { url } from '../../utils/Constants';
import Select from 'react-select';
import ViewPass from "./ViewPass";
import './pass.css';

const CreateNewPass = ({ open, onClose, visitor }) => {
    const initialValues = {
        visitor: visitor.id,
        valid_until: '',
        visiting_purpose: '',
        whom_to_visit: '',
        visiting_department: '',
    };

    const [names, setNames] = useState([]);
    const [names1, setNames1] = useState([]);

    useEffect(() => {
      const storedNames = JSON.parse(localStorage.getItem("names")) || [];
      const storedNames1 = JSON.parse(localStorage.getItem("names1")) || [];
      setNames(storedNames);
      setNames1(storedNames1);
    }, []);

    const steps = ['Visitor Details'];
    const [passData, setPassData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [showViewPass, setShowViewPass] = useState(false);
    const [passCreated, setPassCreated] = useState({});
    const [passoNoteInputValue, setPassoNoteInputValue] = useState('');

    const handleNoteChange = (event) => {
      setPassoNoteInputValue(event.target.value);
    };
  
    useEffect(() => {
        if (visitor) {
            setPassData(currentData => ({
                ...currentData,
                visitor: visitor.id,
            }));
        }
    
        setPassData(currentData => ({
            ...currentData,
            // zones_allowed: selectedZones,
            pass_note: passoNoteInputValue,
        }));
    }, [visitor, passoNoteInputValue]);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassData({ ...passData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };
    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        console.log(name,value)
        setPassData({ ...passData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        let newErrors = {};
        if (activeStep === 0) {
            if (!String(passData.visitor).trim()) newErrors.visitor = 'Visitor ID is required';
            if (!passData.valid_until.trim()) newErrors.valid_until = 'Validity date is required';
            if (!passData.visiting_purpose.trim()) newErrors.visiting_purpose = 'Visiting purpose is required';
            if (!passData.whom_to_visit.trim()) newErrors.whom_to_visit = 'Whom to visit is required';
            if (!passData.visiting_department) newErrors.visiting_department = 'Visiting department is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log("Clicked on Handel Submit Funcrion ")
        if (!validate()) return ;
        try {
            const response = await fetch(`${url}/passes/visitor-pass-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });

            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Pass created successfully');
                setPassCreated(json);
                setShowViewPass(true);
                setPassData(initialValues);
                handleClose();
            } else {
                if (response.status != 200) {Notification.showSuccessMessage('Error', 'Something Went Wrong');}
            }
        } catch (error) {
            Notification.showErrorMessage('Errors', 'Server error');
        }
    };

    const handleClose = () => {
        onClose();
        setActiveStep(0);
        setErrors({});
        setPassData(initialValues);
    };

    const stepContent = (step) => {
        return (
            <>
                <div className="paper_" style={{ display: "flex", marginTop: "50px" }}>
                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="visiting_purpose" className="text-sm font-medium text-gray-700">
                            Visiting Purpose
                    </label>
                    <select
                        id="visiting_purpose"
                        name="visiting_purpose"
                        value={passData.visiting_purpose}
                        onChange={handleInputChange1}
                        className={`border-2 p-3 rounded-lg ${errors.visiting_purpose ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="" disabled>Select  Visiting Porpose</option>
                        {names1.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                    {errors.visiting_purpose && <div className="text-red-500 text-xs">{errors.visiting_purpose}</div>}
                    </div>

                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="whom_to_visit" className="text-sm font-medium text-gray-700">
                        Whom to Visit
                    </label>
                    <select
                        id="whom_to_visit"
                        name="whom_to_visit"
                        value={passData.whom_to_visit}
                        onChange={handleInputChange}
                        className={`border-2 p-3 rounded-lg ${errors.whom_to_visit ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="" disabled>Select Whome To Visit</option>
                        {names.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                    {errors.whom_to_visit && <div className="text-red-500 text-xs">{errors.whom_to_visit}</div>}
                    </div>


                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="visiting_department" className="text-sm font-medium text-gray-700">
                            Visiting Department
                        </label>
                        <select
                            id="visiting_department"
                            name="visiting_department"
                            value={passData.visiting_department}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.visiting_department ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Department</option>
                            <option value="Air Force">Air Force</option>
                            <option value="Army">Army</option>
                            <option value="CPWD">CPWD</option>
                            <option value="Defence">Defence</option>
                            <option value="DGQA">DGQA</option>
                            <option value="IFA (Army-Q )">IFA (Army-Q )</option>
                            <option value="MOD">MOD</option>
                            <option value="MTNL">MTNL</option>
                            <option value="Navy">Navy</option>
                        </select>
                        {errors.visiting_department && <div className="text-red-500 text-xs">{errors.visiting_department}</div>}
                    </div>
                </div>

                <div className="paper_" style={{ display: "flex", marginTop: "50px" }}>
                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="visitor" className="text-sm font-medium text-gray-700">
                            Visitor ID
                        </label>
                        <input
                            type="text"
                            id="visitor"
                            name="visitor"
                            placeholder="Visitor ID"
                            value={passData.visitor}
                            onChange={handleInputChange}
                            disabled
                            className={`border-2 p-3 rounded-lg ${errors.visitor ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.visitor && <div className="text-red-500 text-xs">{errors.visitor}</div>}
                    </div>
                        
                    {/* <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="key" className="text-sm font-medium text-gray-700">
                            Key
                        </label>
                        <Select
                            classNamePrefix="custom-select"
                            value={keyList.map(({ id, physical_key_number }) => ({ value: id, label: physical_key_number })).find(option => option.value === passData.key)}
                            onChange={option => handleInputChange({
                                target: {
                                    name: 'key',
                                    value: option ? option.value : ''
                                }
                            })}
                            options={keyList.map(({ id, physical_key_number }) => ({ value: id, label: physical_key_number }))}
                            placeholder="Select Key"
                            isClearable={true}
                            isSearchable={true}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    border: '2px solid',
                                    borderRadius: '0.5rem',
                                    padding: '8px',
                                    borderColor: '#d1d5db',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    maxHeight: '200px',
                                    overflow: 'auto',
                                    padding: '5px'
                                })
                            }}
                        />
                        {errors.key && <div className="text-red-500 text-xs">{errors.key}</div>}
                    </div> */}

                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="valid_until" className="text-sm font-medium text-gray-700">
                            Valid Until
                        </label>
                        <input
                            type="datetime-local"
                            id="valid_until"
                            name="valid_until"
                            value={passData.valid_until}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.valid_until ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.valid_until && <div className="text-red-500 text-xs">{errors.valid_until}</div>}
                    </div>
                </div>

                {/* <div className="paper_" style={{ display: "flex", marginTop: "50px" }}>
                    <div className="pass_input" style={{ display: "flex", flexDirection: "column" }}>
                        <label className="text-sm font-medium text-gray-700">
                            Zones Allowed
                        </label>
                        <div id="zoneContainer">
                            <div className="select-all-box">
                                <input
                                    type="checkbox"
                                    id="selectAll"
                                    name="selectAll"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                                <label htmlFor="selectAll"> Select All</label>
                            </div>
                            <br />
                            <div id="zoneCheckboxes" className='zone-list-box'>

                                {zoneList.map(zone => (
                                    <div className='zone-list' key={zone.id}>
                                        <input
                                            type="checkbox"
                                            id={`zone-${zone.id}`}
                                            name="zone"
                                            value={zone.id}
                                            checked={selectedZones.includes(zone.id)}
                                            onChange={() => handleZoneChange(zone.id)}
                                        />
                                        <label htmlFor={`zone-${zone.id}`}> {zone.name}</label>
                                    </div>
                                ))}
                            </div>
                            <br/>
                        </div>

                        <div className="select-gate">
                            <div className="select-gate-button">
                                <button onClick={() => handleCounterButtonClick(1)}>G1</button>
                            </div>
                            <div className="select-gate-button">
                                <button onClick={() => handleCounterButtonClick(2)}>G6</button>
                            </div>
                            <div className="hiddenman"></div>
                            <div className='pass-note'>
                                <input type="text" value={passoNoteInputValue} onChange={handleNoteChange} placeholder="Enter Note"/>
                            </div>
                        </div>
                        {errors.zones_allowed && (
                            <div className="text-red-500 text-xs">
                                {errors.zones_allowed}
                            </div>
                        )}
                    </div>
                   
                </div> */}
            </>
        );
    };

    const handleCancel = () => {
        setActiveStep(1);
    };


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="50"
                PaperProps={{ className: "p-8 overflow-hidden" }}
            >
                <DialogTitle
                    as="h2"
                    className="text-lg font-bold leading-6 text-gray-900 text-center"
                >
                    Create New Pass
                </DialogTitle>
                <div className="flex items-center justify-between p-3">
                    {steps.map((label, index) => (
                        <div
                            key={label}
                            className={`flex-1 ${index <= activeStep ? "bg-green-500" : "bg-gray-200"
                                } h-2 mx-2 rounded-full transition duration-500 ease-in-out`}
                        ></div>
                    ))}
                </div>
                <div className="">
                    {stepContent(activeStep)}
                    <div className="flex justify-center mt-8">
                        <button
                            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-500"
                            onClick={handleSubmit}
                        >
                            Generate Pass
                        </button>
                    </div>
                </div>
            </Dialog>
            {passCreated?.visitor && <ViewPass passData={passCreated} open={showViewPass} onClose={() => setShowViewPass(false)} />}
        </>
    );
};

export default CreateNewPass;
