import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { url } from "../../../utils/Constants.jsx";
import Notification from "../../../components/notification";
import { useTranslation } from 'react-i18next';


const AddNewKey = ({ open, onClose, fetchData }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const initialValues = {
        RFID_key: '',
        physical_key_number: ''
    };

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
        setProgress((filledFields / 1) * 100);
    }, [formData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.RFID_key.trim()) { newErrors.RFID_key = 'RFID key is required'; }
        if (!formData.physical_key_number.trim()) { newErrors.physical_key_number = 'Physical number is required'; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    // const handleInputChange1 = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    //     setErrors({ ...errors, [name]: null });
    // };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/key/key-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                Notification.showSuccessMessage("Success", "Key added successfully");
                setFormData(initialValues);
                fetchData();
                onClose();
            } else {
                const json = await response.json();
                const errorMessage = json.error ? json.error : Object.values(json).flat().join(" ") || "An unknown error occurred";
                Notification.showErrorMessage("Error", errorMessage);
            }
        } catch (error) {
            Notification.showErrorMessage("Error", "Server error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <div className="bg-white p-5">
                <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
                    {t("Add New")}-{t("Key")}
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
                        <label htmlFor="RFID_key" className="text-sm font-medium text-gray-700">{t("RFID")} {t("Key")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.RFID_key ? 'border-red-500' : 'border-gray-300'}`}
                            id="RFID_key"
                            name="RFID_key"
                            placeholder={t("RFID")}
                            value={formData.RFID_key}
                            onChange={handleInputChange}
                        />
                        {errors.RFID_key && <div className="text-red-500 text-xs">{errors.RFID_key}</div>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="physical_key_number" className="text-sm font-medium text-gray-700">{t("Physical")} {t("Key Number")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.physical_key_number ? 'border-red-500' : 'border-gray-300'}`}
                            id="physical_key_number"
                            name="physical_key_number"
                            placeholder={t("Physical Number")}
                            value={formData.physical_key_number}
                            onChange={handleInputChange}
                        />
                        {errors.physical_key_number && <div className="text-red-500 text-xs">{errors.physical_key_number}</div>}
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

export default AddNewKey;
