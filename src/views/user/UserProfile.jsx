import React, { useState, useEffect, useContext } from "react";
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from '@mui/icons-material/LockReset';

import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import BlockIcon from '@mui/icons-material/Block';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useTranslation } from 'react-i18next';


const UserProfile = ({ open, onClose, user, onActionClick }) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const userData = user;
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelectedUser, setCurrentSelectedUser] = useState(user);

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm" PaperProps={{ className: "w-1/2 mx-auto" }}>
      <Paper className="p-6 bg-white rounded-lg shadow">
        <div className="text-center border-2 border-gray-300 p-10 rounded-lg shadow-sm">
          <div className="relative">
            <div className="absolute right-0 top-0 p-2">
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleClick(event, user)}
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
                <MenuItem onClick={() => { onActionClick('update', currentSelectedUser); handleClose(); }}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("Update")} />
                </MenuItem>
                <MenuItem onClick={() => { onActionClick('resetPassword', currentSelectedUser); handleClose(); }}>
                  <ListItemIcon>
                    <LockResetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("Reset Password")} />
                </MenuItem>
              </Menu>
            </div>
            <div className="flex justify-center mb-4 mt-2">
              <div className="inline-block h-24 w-24 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen">
                {userData.image ? (
                  <img src={`data:image/jpeg;base64,${userData.image}`} alt="User" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white font-bold bg-customGreen">
                    {userData.first_name ? userData.first_name.charAt(0) : 'N'}
                  </div>
                )}
              </div>
            </div>

          </div>
          <div className=" p-1 rounded-lg shadow-sm">
            <div className="mb-2 font-bold text-xl">
              {`${userData.first_name} ${userData.last_name}`}
            </div>
            <div className="divide-y divide-gray-300">
              <InfoItem icon={<PersonIcon color="primary" />} label={t("User Type")} value={userData.user_type} />
              <InfoItem icon={<HomeIcon color="secondary" />} label={t("Address")} value={userData.address} />
              <InfoItem icon={<PhoneIcon color="action" />} label={t("Phone No")} value={userData.phone} />
              <InfoItem icon={<BadgeIcon color="info" />} label={t("Gov ID No")} value={userData.employee_code} />
              <InfoItem icon={<BloodtypeIcon color="warning" />} label={t("Blood Group")} value={userData.blood_group} />
              <InfoItem icon={<BlockIcon color={userData.blacklisted ? 'error' : 'success'} />} label={t("Is Active")} value={userData.is_active ? "Yes" : "No"} />
              <InfoItem icon={<VpnKeyIcon color="primary" />} label={t("Is Staff")} value={userData.is_staff ? "Yes" : "No"} />
            </div>
          </div>
        </div>
      </Paper>
    </Dialog>
  );
};

const InfoItem = ({ icon, label, value, isReversed = false }) => (
  <div className={`py-2 flex items-center ${isReversed ? 'justify-between' : ''}`}>
    <div className="flex items-center">
      {icon}
      <span className={`${isReversed ? 'order-last ml-1' : 'ml-1'} font-bold`}>{label}</span>
    </div>
    <span className='ml-1'>:</span>
    {isReversed && <span>{value}</span>}
    {!isReversed && <span className="ml-2">{value}</span>}
  </div>
);

export default UserProfile;
