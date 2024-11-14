import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { url } from "../../../utils/Constants.jsx";
import Notification from "../../../components/notification";
import { useTranslation } from 'react-i18next';


const AddNewAdam = ({ open, onClose, fetchData }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const initialValues = {
        ip: '',
        port: '',
        address: '',
        name: ''
    };

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
        setProgress((filledFields / 4) * 100);
    }, [formData]);

    const validate = () => {
        const newErrors = {};

        if (!formData.ip.trim()) { newErrors.ip = 'IP address is required'; }
        else if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(formData.ip.trim())) { newErrors.ip = 'Invalid IP address'; }

        if (!formData.actuation_port.trim()) { newErrors.actuation_port = 'Address is required'; }
        if (!formData.name.trim()) { newErrors.name = 'Name is required'; }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/gadgets/adam/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                Notification.showSuccessMessage("Success", "Device added successfully");
                setFormData(initialValues);
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <div className="bg-white p-5">
                <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
                    Add New Adam
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
                        <label htmlFor="ip" className="text-sm font-medium text-gray-700">{t("IP")} {t("Address")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.ip ? 'border-red-500' : 'border-gray-300'}`}
                            id="ip"
                            name="ip"
                            placeholder="Eg. 192.168.1.1"
                            value={formData.ip}
                            onChange={handleInputChange}
                        />
                        {errors.ip && <div className="text-red-500 text-xs">{errors.ip}</div>}

                        <label htmlFor="actuation_port" className="text-sm font-medium text-gray-700">{t("Address")}</label>
                        <select
                            className={`border-2 p-3 rounded-lg ${errors.actuation_port ? 'border-red-500' : 'border-gray-300'}`}
                            id="actuation_port"
                            name="actuation_port"
                            value={formData.actuation_port}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Address</option>
                            {[16, 17, 18, 19, 20, 21, 22].map(addr => (
                                <option key={addr} value={addr}>{addr}</option>
                            ))}
                        </select>
                        {errors.actuation_port && <div className="text-red-500 text-xs">{errors.actuation_port}</div>}

                        <label htmlFor="name" className="text-sm font-medium text-gray-700">{t("Name")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            id="name"
                            name="name"
                            placeholder="Eg. Gate-01 Entry"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            className="py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-customGreen hover:bg-green-500"
                            onClick={handleSubmit}
                        >
                            {t("Save")}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddNewAdam;
