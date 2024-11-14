import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Alert from "../../components/alert/index.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Pagination from "../../components/pagination/index.jsx";
import { useTranslation } from 'react-i18next';
import { url } from "../../utils/Constants";
import Notification from "../../components/notification";
import CameraModal from "../../components/camera";

import './My_alert.css'


const Visitors = ({ visitors, totalVisitors, isLoading, fetchData, onActionClick, searchParams, setSearchParams ,setSearchByFace, getSimilarFace}) => {
  // *******************************************************************
  
  const [showAlert, setShowAlert] = useState(false);
  const [showWhitelistAlert, setWhitelistAlert] = useState(false);
  const [reason, setReason] = useState(" ");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageData, setImageData] = useState('');


  const handelGetSimilarFace = (base64Image) => {
        getSimilarFace(base64Image)
        setImageModalOpen(false);
  };


  const handleOpenAlert = () => {
    handleClose();
    setShowAlert(true);

  };

  const handleOpenwhitelistAlert = () => {
    handleClose();
    setWhitelistAlert(true);

  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setWhitelistAlert(false);
  };

  const handleBlacklist = () => {
    console.log('Blacklist reason:', reason);
    // Handle the submit action here
    handelBlacklistrequest(currentSelectedVisitor)
    setShowAlert(false);
  };

  const handleWhiteBlacklist = () => {
    console.log('Blacklist reason:', reason);
    // Handle the submit action here
    handelWhiteBlacklistrequest(currentSelectedVisitor)
    setWhitelistAlert(false);
  };

  // *******************************************************************

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedVisitor, setCurrentSelectedVisitor] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showBlackListeAlert, setShowBlackListeAlert] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);



  const handleClick = (event, visitor) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedVisitor(visitor);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (visitor) => {
    setCurrentSelectedVisitor(visitor);
    setShowDeleteAlert(true);
    handleClose();
  };

  const confirmDelete = () => {
    console.log("Deleting...");
    console.log(currentSelectedVisitor);
    setShowDeleteAlert(false);
    // Perform delete action
  };
  // -----------------------------------------------------------
  // const handelBlacklist = (visitor) => {
  //   setCurrentSelectedVisitor(visitor);
  //   setShowBlackListeAlert(true);
  //   handleClose();
  // };

  const confirmblacklist = () => {
    console.log("Deleting...");
    console.log(currentSelectedVisitor);
    setShowBlackListeAlert(false);
    handelBlacklistrequest(currentSelectedVisitor)
    
    // Perform blacklist action
  };

  const handelBlacklistrequest = async (visitor) => {
    try {
      const response = await fetch(
        `${url}/visitor/blacklist/${visitor.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({"other": reason}),
        }
      );

      if (response.ok) {
        Notification.showSuccessMessage("Success", "Visitor Blacklisted Successfully");
        fetchData();
        // handleClose();
        // fetchData();
      } else {
        const json = await response.json();
        Notification.showErrorMessage("Error", json.error);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };

  const handelWhiteBlacklistrequest = async (visitor) => {
    try {
      const response = await fetch(
        `${url}/visitor/whitelist/${visitor.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({"other": reason}),
        }
      );

      if (response.ok) {
        Notification.showSuccessMessage("Success", "Visitor Whitelisted Successfully");
        fetchData();
        // handleClose();
        // fetchData();
      } else {
        const json = await response.json();
        Notification.showErrorMessage("Error", json.error);
      }
    } catch (error) {
      Notification.showErrorMessage("Error", "Server error");
    }
  };
  // ----------------------------------------------------------------

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    const newName = `${name}__icontains`;
    setSearchParams({ ...searchParams, [newName]: value });
    setCurrentPage(1);
  };

  const handleLimitChange = (event) => {
    setSearchParams({ ...searchParams, limit: event.target.value, offset: 0 });
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (offset) => {
    setSearchParams({ ...searchParams, offset });
  };

  useEffect(() => {
    handlePageChange((currentPage - 1) * itemsPerPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalVisitors / itemsPerPage);

  return (
    <div style={{marginBottom:"55px"}}>
      <div className="flex justify-between items-center m-6">
        <div className="flex items-center space-x-2">
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            name="first_name"
            value={searchParams.first_name}
            onChange={handleSearchChange}
            placeholder={t("Search by first name")}
          />
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            name="last_name"
            value={searchParams.last_name}
            onChange={handleSearchChange}
            placeholder={t("Search by last name")}
          />
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            name="phone"
            value={searchParams.phone}
            onChange={handleSearchChange}
            placeholder={t("Search by phone number")}
          />
          <input
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            type="text"
            name="gov_id_no"
            value={searchParams.gov_id_no}
            onChange={handleSearchChange}
            placeholder={t("Search by govt ID number")}
          />
          <button 
            className="appearance-none border border-customGreen rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-700"
            onClick={() => setImageModalOpen(true)}
          >
            Search By Face
            </button>
            <CameraModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} onCaptured={handelGetSimilarFace} />
          <select
            value={searchParams.limit}
            onChange={handleLimitChange}
            className="border border-customGreen rounded-3xl bg-white py-2 px-3 text-gray-700 focus:outline-none"
          >
            {[5, 10, 20, 30, 50].map(size => (
              <option key={size} value={size}>{size} {t("per page")}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center bg-customGreen hover:bg-green-700 text-white py-1 px-4 rounded-3xl" onClick={() => { onActionClick('addNewVisitor'); handleClose(); }}>
            <AddIcon className="h-4 w-5 mr-2" />
            {t("Add New")}
          </button>
        </div>
      </div>
      {isLoading ? (
        <Box
          style={{
            height: "50vh",
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : visitors?.length > 0 ? (
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light text-center">{t("Visitor")} {t("Image")}</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                {t("Visitor")} {t("Name")}
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                {t("Visitor")} {t("Type")}
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  {t("Phone No")}
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                   {t("Government Type")}
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                {t("Government ID")}
                </th>
              
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  {t("Action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {visitors?.map((visitor, index) => (
                <tr key={visitor.id} className="hover:bg-grey-lighter" style={{backgroundColor: visitor.is_blacklisted ?"#ffcece":"white" }}  >
                  <td className="py-1 px-1 border-b border-grey-light">
                    <div className="flex justify-center">
                      <div className="inline-block h-16 w-16 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                        {visitor.image ? (
                          <img src={`data:image/jpeg;base64,${visitor.image}`} alt="User" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white bg-customGreen">
                            {visitor.first_name ? visitor.first_name.charAt(0).toUpperCase() : 'N'}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.first_name} {visitor.last_name}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.visitor_type}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.phone}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.gov_id_type.replace('_', ' ')}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {visitor.gov_id_no}
                  </td>
                
                  <td className="py-4 px-6 border-b border-grey-light">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, visitor)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => { onActionClick('view', currentSelectedVisitor); handleClose(); }}>
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("View")} />
                      </MenuItem>
                      <MenuItem onClick={() => { onActionClick('update', currentSelectedVisitor); handleClose(); }}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("Update")} />
                      </MenuItem>
                      <MenuItem onClick={() => { handleDelete(currentSelectedVisitor) }}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t("Delete")} />
                      </MenuItem>
                      { currentSelectedVisitor && !currentSelectedVisitor.is_blacklisted && (
                        <>
                          <MenuItem onClick={() => { onActionClick('pass', currentSelectedVisitor); handleClose(); }}>
                            <ListItemIcon>
                              <CreditCardIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("Generate Pass")} />
                          </MenuItem>

                          {/* <MenuItem onClick={() => {handelBlacklist(currentSelectedVisitor) }}>0 */}
                          <MenuItem onClick={handleOpenAlert}>
                            <ListItemIcon>
                              <CreditCardIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("Blacklist")} />
                          </MenuItem>
                        </>
                      )}
                      { currentSelectedVisitor && currentSelectedVisitor.is_blacklisted && (
                        <>
                          <MenuItem onClick={handleOpenwhitelistAlert}>
                            <ListItemIcon>
                              <CreditCardIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={t("Whitelist")} />
                          </MenuItem>
                        </>
                      )}
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
        </div>) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', textAlign: 'center' }}>
          <p>No Visitor found.</p>
        </Box>
      )}
      <Alert
        open={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this Visitor?"
        buttonText="Delete"
        buttonColor="red"
        onButtonClick={confirmDelete}
      />
      <Alert
        open={showBlackListeAlert}
        onClose={() => setShowBlackListeAlert(false)}
        title="Confirm Blacklist"
        message="Are you sure you want to Blacklist this Visitor?"
        buttonText="Blacklist"
        buttonColor="red"
        onButtonClick={confirmblacklist}
      />
      {/* ------------------------Shah Code--------------------------------- */}
      <div className="App">
        {showAlert && (
          <div className="overlay">
            <div className="alert-box">
              <button className="close-btn" onClick={handleCloseAlert}>&times;</button>
              <h3>Confirm Blacklist</h3>
              <p>Are you sure you want to Blacklist this Visitor?</p>
              <div>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for blacklist"
                  required
                />
                <button onClick={handleBlacklist}>BLACKLIST</button>
              </div>
              <button className="close-alert" onClick={handleCloseAlert}>Close</button>
            </div>
          </div>
        )}
      </div>

      <div className="App">
        {showWhitelistAlert && (
          <div className="overlay">
            <div className="alert-box">
              <button className="close-btn" onClick={handleCloseAlert}>&times;</button>
              <h3>Confirm</h3>
              <p>Give a valid reason to make whitelist this visitor?</p>
              <div>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for blacklist"
                  required
                />
                <button onClick={handleWhiteBlacklist}>Whitelist</button>
              </div>
              <button className="close-alert" onClick={handleCloseAlert}>Close</button>
            </div>
          </div>
        )}
      </div>
      {/* ----------------------------------------------------------- */}
      
    </div>
  );
};

export default Visitors;