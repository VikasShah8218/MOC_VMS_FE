import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { url } from "../../../utils/Constants.jsx";
import Notification from "../../../components/notification";
import { useTranslation } from 'react-i18next';

const initialValues = {
    name: '',       
    client_ip: '',  
    adam: '',       
    other: ''        
};
const UpdateZone = ({ open, onClose, fetchData, zoneData }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(0);
    const [adamData, setAdamData] = useState({});


    useEffect(() => {
        setFormData(zoneData);
    }, [zoneData]);

    useEffect(() => {
        const filledFields = Object.values(formData).filter(value => value !== null && value.toString().trim() !== '').length;
        setProgress((filledFields / 2) * 100);
    }, [formData]);

    const validate = () => {
        const newErrors = {};
        // if (!formData.zone_name.trim()) {
        //     newErrors.zone_name = 'Zone name is required';
        // }
        if (!formData.name?.trim()) { newErrors.name = 'Name is required'; }
        if (!formData.client_ip?.trim()) { newErrors.client_ip = 'IP is Required'; }
        // if (!formData.adam?.trim()) { newErrors.adam = 'Adam name is required'; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const fetchAdamData = async () => {
        // setIsLoading(true);
        try {
            const response = await fetch(`${url}/gadgets/adam/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAdamData(data);
                console.log("********HI*************")
                setTimeout(() => {
                    console.log(adamData)
                    
                }, 300);
                // setFilteredData(data);
            } else {
                Notification.showErrorMessage("Try Again!", data.error);
            }
        } catch (err) {
            Notification.showErrorMessage("Error", "Server error!");
        }
        // setIsLoading(false);
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/gadgets/adam-linkedwith/${zoneData.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                Notification.showSuccessMessage("Success", "Zone updated successfully");
                fetchData();
                onClose();
            } else {
                const json = await response.json();
                Notification.showErrorMessage("Error", json.error);
            }
        } catch (error) {
            Notification.showErrorMessage("Error", "Server error");
        }
    };

    const handleClose = () => {
        onClose();
        setErrors({});
        setFormData({});
    };

    useEffect(() => {
        fetchAdamData()
    }, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <div className="bg-white p-5">
                <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
                     {t("New")} {t("Zone")}
                </DialogTitle>
                <div className='px-5'>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200">
                        <div
                            className="bg-green-500 h-full"
                            style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
                        ></div>
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">{t("Name")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                        <label htmlFor="client_ip" className="text-sm font-medium text-gray-700">{t("Client IP")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.client_ip ? 'border-red-500' : 'border-gray-300'}`}
                            id="client_ip"
                            name="client_ip"
                            placeholder="192.168.0.1"
                            value={formData.client_ip}
                            onChange={handleInputChange}
                        />
                        {errors.client_ip && <div className="text-red-500 text-xs">{errors.client_ip}</div>}

                        <label htmlFor="adam" className="text-sm font-medium text-gray-700">{t("Allow Re-Entry")}</label>
                        <select
                            className={`border-2 p-3 rounded-lg ${errors.adam ? 'border-red-500' : 'border-gray-300'}`}
                            id="adam"
                            name="adam"
                            value={formData.adam}
                            onChange={handleInputChange}
                        >
                             <option >
                                       Select
                            </option>
                            {adamData.length > 0 ? (
                                adamData.map(item => (
                                    <option key={item.id} value={parseInt(item.id)}>
                                        {item.name}
                                    </option>
                                   
                                ))
                            ) : (
                                <option disabled>Loading...</option>
                            )}
                        </select>
                        {errors.adam && <div className="text-red-500 text-xs">{errors.adam}</div>}

                        <label htmlFor="other" className="text-sm font-medium text-gray-700">{t("other")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg border-gray-300`}
                            id="other"
                            name="other"
                            placeholder="other"
                            value={formData.other}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            className="py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-customGreen hover:bg-green-500"
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default UpdateZone
