import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Badge,
  Popover,
  MenuList,
  MenuItem,
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
import ResultPage from "../../pages/ResultPage/ResultPage";

const DashboardPanel = () => {
  const { logout } = useAuth();
  const { notifications } = useTeacherData();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const openNotif = Boolean(notifAnchorEl);
  const openMenu = Boolean(menuAnchorEl);

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
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const routeTitleMap = {
    "/dashboard/results": "/Results",
    "/dashboard/students": "/Students",
    "/dashboard/createuser": "/Create User",
    "/dashboard/createtest": "/Create Test",
    "/dashboard/settings": "/Settings",
    "/dashboard/profile": "/Profile",
    "/dashboard": "/Dashboard",
  };

  const matchedRoute = Object.keys(routeTitleMap)
    .sort((a, b) => b.length - a.length)
    .find((route) => location.pathname.startsWith(route));

  const currentTitle = routeTitleMap[matchedRoute] || "/Dashboard";


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
                <Badge
                  badgeContent={notifications.filter(n => !n.read).length}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Popover
                anchorEl={notifAnchorEl}
                open={openNotif}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuList>
                  {notifications.length === 0 ? (
                    <MenuItem disabled>Fără notificări</MenuItem>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => {
                          handleNotifClose();
                          if (notif.type === "testCompleted" && notif.completedTestId) {
                            navigate(
                              `/dashboard/results/${notif.studentId}/${notif.completedTestId}/${notif.id}`
                            );
                          }
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {!notif.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "red",
                              }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notif.read ? "normal" : "bold",
                              whiteSpace: "normal",
                            }}
                          >
                            {notif.message}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </MenuList>

              </Popover>

              <IconButton onClick={handleMenuClick}>
                <Avatar alt="Teacher" src="/avatar.png" />
              </IconButton>
              <Popover
                anchorEl={menuAnchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuList>
                  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Popover>
            </Box>
          </Box>
        </div>

        <div className={styles.content}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="createuser" element={<CreateUserPage />} />
            <Route path="createtest" element={<CreateTestPage />} />
            <Route path="results/:studentId/:completedTestId/:notifId" element={<ResultPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
