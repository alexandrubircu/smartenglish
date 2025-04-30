import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import styles from './DashboardPanel.module.scss';

// pages
import DashboardOverview from "../../pages/DashboardOverview/DashboardOverview";
import StudentsPage from "../../pages/StudentsPage/StudentsPage";
import CreateUserPage from "../../pages/CreateUserPage/CreateUserPage";
import CreateTestPage from "../../pages/CreateTestPage/CreateTestPage";

const DashboardPanel = () => {
  const { logout } = useAuth();
  const { notifications } = useTeacherData();
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const openNotif = Boolean(notifAnchorEl);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log("Eroare la logare: " + err.message);
    }
  };

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };



  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = () => {
    handleClose();
  };

  //Mapper pentru titluri
  const routeTitleMap = {
    "/dashboard": "/Dashboard",
    "/dashboard/students": "/Students",
    "/dashboard/settings": "/Settings",
    "/dashboard/profile": "/Profile",
  };

  const currentTitle = routeTitleMap[location.pathname] || "/Dashboard";

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboard}>
        <div className={styles.heder}>
          <Box className={styles.headerContent}>
            <Typography variant="h6" className={styles.title}>{currentTitle}</Typography>

            <Box className={styles.actions}>

              <Button
                variant="outlined"
                size="small"
                className={styles.assignBtn}
                onClick={() => navigate('/dashboard/createuser')}
              >
                Add User
              </Button>

              <Button
                variant="outlined"
                size="small"
                className={styles.assignBtn}
                onClick={() => navigate('/dashboard/students')}
              >
                Assign Test
              </Button>

              <IconButton onClick={handleNotifClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notifAnchorEl}
                open={openNotif}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>Fără notificări</MenuItem>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <MenuItem key={notif.id} onClick={handleNotifClose}>
                      {notif.message}
                    </MenuItem>
                  ))
                )}
              </Menu>


              <IconButton onClick={handleMenuClick}>
                <Avatar alt="Teacher" src="/avatar.png" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleMenuSelect()}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </div>
        <div className={styles.content}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="createuser" element={<CreateUserPage />} />
            <Route path="createtest" element={<CreateTestPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
