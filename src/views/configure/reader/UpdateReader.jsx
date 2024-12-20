import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { url } from "../../../utils/Constants.jsx";
import Notification from "../../../components/notification";
import { useTranslation } from 'react-i18next';


const UpdateReader = ({ open, onClose, fetchData, readerData }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(0);
    const [adamList, setAdamList] = useState([{}]);
    const [zoneList, setZoneList] = useState([{}]);

    const getAdamList = async () => {
        try {
            const response = await fetch(`${url}/gadgets/get-adam/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const json = await response.json();
            if (response.ok) {
                const adamDetails = json.map(adam => ({
                    id: adam.id,
                    name: adam.name
                }));
                setAdamList(adamDetails);
            } else {
                Notification.showErrorMessage("Try Again!", json.error);
            }
        } catch (err) {
            Notification.showErrorMessage("Error", "Server error!");
        }
    };
    const getZoneList = async () => {
        try {
            const response = await fetch(`${url}/zone/zone-info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const json = await response.json();
            if (response.ok) {
                const zoneDetails = json.map(zone => ({
                    id: zone.id,
                    zoneName: zone.zone_name
                }));
                setZoneList(zoneDetails);
            } else {
                Notification.showErrorMessage("Try Again!", json.error);
            }
        } catch (err) {
            Notification.showErrorMessage("Error", "Server error!");
        }
    }

    useEffect(() => {
        getAdamList();
        getZoneList();
    }, []);

    useEffect(() => {
        setFormData(readerData);
    }, [readerData]);

    useEffect(() => {
        const filledFields = Object.values(formData).filter(value => value !== null && value.toString().trim() !== '').length;
        setProgress((filledFields / 7) * 100);
    }, [formData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.reader_type || !["entry", "exit", "tracking"].includes(formData.reader_type)) {
            newErrors.reader_type = 'Reader type is invalid';
        }
        if (!formData.com_port || !/^([A-Z]+\d{1,4})$/.test(formData.com_port) || formData.com_port.length < 4 || formData.com_port.length > 6) {
            newErrors.com_port = 'COM port is invalid';
        }
        
        if (!formData.moxa_ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.moxa_ip)) {
            newErrors.moxa_ip = 'Moxa IP is invalid';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        // if (!formData.adam) {
        //     newErrors.adam = 'ADAM module selection is required';
        // }
        if (!formData.zone) {
            newErrors.zone = 'Zone selection is required';
        }
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
            const response = await fetch(`${url}/gadgets/update-reader/${readerData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                Notification.showSuccessMessage("Success", "Reader updated successfully");
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
    useEffect(()=>{console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/")
    console.log(zoneList)} )
    

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <div className="bg-white p-5">
                <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
                    Update Reader Details
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
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">{t("Reader")} {t("Name")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            id="name"
                            name="name"
                            placeholder="Enter reader name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}

                        <label htmlFor="reader_type" className="text-sm font-medium text-gray-700">{t("Reader")} {t("Type")}</label>
                        <select
                            className={`border-2 p-3 rounded-lg ${errors.reader_type ? 'border-red-500' : 'border-gray-300'}`}
                            id="reader_type"
                            name="reader_type"
                            value={formData.reader_type}
                            onChange={handleInputChange}
                        >
                            <option value="entry">Entry</option>
                            <option value="exit">Exit</option>
                            <option value="tracking">Tracking</option>
                        </select>
                        {errors.reader_type && <div className="text-red-500 text-xs">{errors.reader_type}</div>}

                        <label htmlFor="com_port" className="text-sm font-medium text-gray-700">{t("COM")} {t("Port")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.com_port ? 'border-red-500' : 'border-gray-300'}`}
                            id="com_port"
                            name="com_port"
                            placeholder="Enter COM port"
                            value={formData.com_port}
                            onChange={handleInputChange}
                        />
                        {errors.com_port && <div className="text-red-500 text-xs">{errors.com_port}</div>}

                        <label htmlFor="moxa_ip" className="text-sm font-medium text-gray-700">{t("Moxa")} {t("IP")}</label>
                        <input
                            type="text"
                            className={`border-2 p-3 rounded-lg ${errors.moxa_ip ? 'border-red-500' : 'border-gray-300'}`}
                            id="moxa_ip"
                            name="moxa_ip"
                            placeholder="192.168.1.1"
                            value={formData.moxa_ip}
                            onChange={handleInputChange}
                        />
                        {errors.moxa_ip && <div className="text-red-500 text-xs">{errors.moxa_ip}</div>}

                        <label htmlFor="adam" className="text-sm font-medium text-gray-700">{t("Adam")} {t("Module")}</label>
                        <select
                            className={`border-2 p-3 rounded-lg ${errors.adam ? 'border-red-500' : 'border-gray-300'}`}
                            id="adam"
                            name="adam"
                            value={(formData.adam)}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Adam</option>
                            {adamList.map((adam, index) => (
                                <option key={index} value={adam.id}>{adam.name}</option>
                            ))}
                        </select>
                        {errors.adam && <div className="text-red-500 text-xs">{errors.adam}</div>}

                        <label htmlFor="zone" className="text-sm font-medium text-gray-700">{t("Zone")}</label>
                        <select
                            className={`border-2 p-3 rounded-lg ${errors.zone ? 'border-red-500' : 'border-gray-300'}`}
                            id="zone"
                            name="zone"
                            value={formData.zone}
                            onChange={handleInputChange}
                        >   
                         
                            {zoneList.map((zone, index) => (
                                <option key={index} value={zone.id}>
                                    {zone.zoneName}
                                </option>
                            ))}
                           
                        </select>
                        {errors.zone && <div className="text-red-500 text-xs">{errors.zone}</div>}
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            className="py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-customGreen hover:bg-green-500"
                            onClick={handleSubmit}
                        >
                            {t("Update")}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default UpdateReader;
