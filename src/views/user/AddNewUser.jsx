import React, { useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import Notification from "../../components/notification";
import { url } from "../../utils/Constants";
import CameraModal from "../../components/camera";
import SignatureCapture from "../../components/SignatureCapture/SignatureCapture";
import { useTranslation } from 'react-i18next';

const steps = ['Personal Details', 'Work Information', 'Account Settings', 'Additional Details'];

const AddNewUser = ({ open, onClose, fetchData }) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const initialValues = {
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    user_type: '',
    blood_group: '',
    department: '',
    work_location: '',
    username: '',
    employee_code: '',
    password: '',
    confirm_password: '',
    image: '',
    signature: ''
  }

  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [imageData, setImageData] = useState('');
  const [signatureData, setSignatureData] = useState('');

  const validate = () => {
    const newErrors = {};
    switch (activeStep) {
      case 0:
        if (!userData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!userData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!userData.phone || !userData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else {
          const cleanPhone = userData.phone.trim().replace(/\D/g, '');
          if (cleanPhone.length !== 10) {
            newErrors.phone = 'Phone number should be 10 digits';
          } else if (!/^\d{10}$/.test(cleanPhone)) {
            newErrors.phone = 'Phone number should be numeric';
          }
        }

        if (!userData.address.trim()) newErrors.address = 'Address is required';
        break;
      case 1:
        if (!userData.user_type.trim()) newErrors.user_type = 'User type is required';
        if (!userData.department.trim()) newErrors.department = 'Department is required';
        if (!userData.work_location.trim()) newErrors.work_location = 'Work location is required';
        break;
      case 2:
        if (!userData.username.trim()) newErrors.username = 'Username is required';
        if (!userData.employee_code.trim()) newErrors.employee_code = 'Employee code is required';
        if (!userData.password) {
          newErrors.password = 'Password is required';
        } else if (userData.password.length <= 5) {
          newErrors.password = 'Password must be longer than 5 characters';
        }

        if (userData.password !== userData.confirm_password) {
          newErrors.confirm_password = 'Passwords must match';
        }

        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (activeStep < steps.length - 1) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      } else {
        handleSave();
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: null }); // Clear errors
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      userData.image = imageData;
      userData.signature = signatureData;
      const response = await fetch(`${url}/accounts/create-users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Notification.showSuccessMessage("Success", "User Added Successfully");
        fetchData();
        setUserData(initialValues);
        handleClose();
      } else {
        const json = await response.json();
        let message = ""
        Object.values(json).forEach(value => {
          console.log(value); // prints value
          message = message + value[0] + "\n"
        });
        Notification.showErrorMessage("Error", message);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  const handleImageCapture = (base64Image) => {
    console.log(base64Image);
    setImageData(base64Image);
    setImageModalOpen(false);
  };

  const handleSignatureCapture = (base64Image) => {
    setSignatureData(base64Image);
    setSignatureModalOpen(false);
  };

  const handleClose = () => {
    onClose();
    setActiveStep(0);
    setErrors({});
    setSignatureData("");
    setImageData("");
    setUserData(initialValues);
  }

  const stepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium text-gray-700">{t("First Name")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
              id="first_name"
              name="first_name"
              placeholder={t("First Name")}
              value={userData.first_name}
              onChange={handleInputChange}
            />
            {errors.first_name && <div className="text-red-500 text-xs">{errors.first_name}</div>}

            <label htmlFor="last_name" className="text-sm font-medium text-gray-700">{t("Last Name")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
              id="last_name"
              name="last_name"
              placeholder={t("Last Name")}
              value={userData.last_name}
              onChange={handleInputChange}
            />
            {errors.last_name && <div className="text-red-500 text-xs">{errors.last_name}</div>}

            <label htmlFor="phone" className="text-sm font-medium text-gray-700">{t("Phone No")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              id="phone"
              name="phone"
              placeholder={t("Phone No")}
              value={userData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}

            <label htmlFor="address" className="text-sm font-medium text-gray-700">{t("Address")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              id="address"
              name="address"
              placeholder={t("Address")}
              value={userData.address}
              onChange={handleInputChange}
            />
            {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col space-y-2">
            <label htmlFor="user_type" className="text-sm font-medium text-gray-700">{t("User Type")}</label>
            <select
              className={`border-2 p-3 rounded-lg ${errors.user_type ? 'border-red-500' : 'border-gray-300'}`}
              id="user_type"
              name="user_type"
              value={userData.user_type}
              onChange={handleInputChange}
            >
              <option value="">Select User Type</option>
              <option value="Admin">Admin</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Guard">Guard</option>
            </select>
            {errors.user_type && <div className="text-red-500 text-xs">{errors.user_type}</div>}

            <label htmlFor="blood_group" className="text-sm font-medium text-gray-700">{t("Blood Group")}</label>
            <select
              className={`border-2 p-3 rounded-lg ${errors.blood_group ? 'border-red-500' : 'border-gray-300'}`}
              id="blood_group"
              name="blood_group"
              value={userData.blood_group}
              onChange={handleInputChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <label htmlFor="department" className="text-sm font-medium text-gray-700">{t("Department")}</label>
            <select
              className={`border-2 p-3 rounded-lg ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
              id="department"
              name="department"
              value={userData.department}
              onChange={handleInputChange}
            >
              <option value="">Select Department</option>
              <option value="hr">Human Resources</option>
              <option value="it">Information Technology</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
            {errors.department && <div className="text-red-500 text-xs">{errors.department}</div>}

            <label htmlFor="work_location" className="text-sm font-medium text-gray-700">{t("Work Location")}</label>
            <select
              className={`border-2 p-3 rounded-lg ${errors.work_location ? 'border-red-500' : 'border-gray-300'}`}
              id="work_location"
              name="work_location"
              value={userData.work_location}
              onChange={handleInputChange}
            >
              <option value="">Select Work Location</option>
              <option value="Gate-01">Gate-01</option>
              <option value="Gate-06">Gate-06</option>
            </select>
            {errors.work_location && <div className="text-red-500 text-xs">{errors.work_location}</div>}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">{t("Username")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              id="username"
              name="username"
              placeholder={t("Username")}
              value={userData.username}
              onChange={handleInputChange}
            />
            {errors.username && <div className="text-red-500 text-xs">{errors.username}</div>}

            <label htmlFor="employee_code" className="text-sm font-medium text-gray-700">{t("Employee Code")}</label>
            <input
              className={`border-2 p-3 rounded-lg ${errors.employee_code ? 'border-red-500' : 'border-gray-300'}`}
              id="employee_code"
              name="employee_code"
              placeholder={t("Employee Code")}
              value={userData.employee_code}
              onChange={handleInputChange}
            />
            {errors.employee_code && <div className="text-red-500 text-xs">{errors.employee_code}</div>}

            <label htmlFor="password" className="text-sm font-medium text-gray-700">{t("Password")}</label>
            <input
              type="password"
              className={`border-2 p-3 rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              id="password"
              name="password"
              placeholder={t("Password")}
              value={userData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}

            <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">{t("Confirm Password")}</label>
            <input
              type="text"
              className={`border-2 p-3 rounded-lg ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
              id="confirm_password"
              name="confirm_password"
              placeholder={t("Confirm Password")}
              value={userData.confirm_password}
              onChange={handleInputChange}
            />
            {errors.confirm_password && <div className="text-red-500 text-xs">{errors.confirm_password}</div>}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-row space-x-4 p-4">
            <div className="space-y-4 flex flex-col items-center">
              <label htmlFor="image" className="text-sm font-semibold text-gray-700">{t("Image")}</label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center justify-center relative" style={{ width: '200px', height: '200px' }}>
                {imageData ? (
                  <img src={`data:image/jpeg;base64,${imageData}`} alt="Captured Image" className="max-h-full max-w-full rounded" />
                ) : (
                  <span className="text-gray-500">No image captured</span>
                )}
              </div>
              <button className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl" onClick={() => setImageModalOpen(true)}>
                {t("Capture Image")}
              </button>
              <CameraModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onCaptured={handleImageCapture} />
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <label htmlFor="signature" className="text-sm font-semibold text-gray-700">{t("Signature")}</label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center justify-center relative" style={{ width: '200px', height: '200px' }}>
                {signatureData ? (
                  <img src={`data:image/jpeg;base64,${signatureData}`} alt="Captured Signature" className="max-h-full max-w-full rounded" />
                ) : (
                  <span className="text-gray-500">No signature captured</span>
                )}
              </div>
              {/* <button className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl" onClick={() => setSignatureModalOpen(true)}>
                Capture Signature
              </button> */}
              <SignatureCapture onCapture={handleSignatureCapture} />
              {/* <CameraModal open={signatureModalOpen} onClose={() => setSignatureModalOpen(false)} onCaptured={handleSignatureCapture} /> */}
            </div>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "w-1/2 mx-auto my-8 p-8 overflow-hidden" }}
    >
      <div className="bg-white p-5">
        <DialogTitle as="h2" className="text-lg font-bold leading-6 text-gray-900 text-center">
          {t("Add New User")}
        </DialogTitle>
        <div className="flex items-center justify-between p-3">
          {steps.map((label, index) => (
            <div key={label} className={`flex-1 ${index <= activeStep ? 'bg-green-500' : 'bg-gray-200'} h-2 mx-2 rounded-full transition duration-500 ease-in-out`}></div>
          ))}
        </div>
        <div className="px-4 py-5 sm:p-6">
          {stepContent(activeStep)}
          <div className="flex justify-between mt-8">
            <button
              className={`py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${activeStep === 0 ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-700'}`}
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              {t("Back")}
            </button>
            {activeStep === steps.length - 1 ? (
              <button
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            ) : (
              <button
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700"
                onClick={handleNext}
              >
                {t("Continue")}
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewUser;
