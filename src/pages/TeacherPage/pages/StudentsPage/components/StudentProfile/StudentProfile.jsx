import React, { useState } from "react";
import {
  Box, Typography, Avatar, Button, IconButton, Menu, MenuItem, Tabs, Tab, TextField, List, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from "./StudentProfile.module.scss";

const StudentProfile = ({ student }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const filteredTests = student?.tests?.filter(test =>
    test.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (!student) return <div className={styles.empty}>Selectează un student</div>;

  return (
    <div className={styles.profileCard}>
      <Box className={styles.cardWrapper}>
        <Box className={styles.header}>
          <Avatar src="/avatar.png" className={styles.avatar} />
          <Box className={styles.details}>
            <Typography variant="h6" className={styles.name}>{student.name}</Typography>
          </Box>
          <IconButton onClick={handleMenuClick} className={styles.menuBtn}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>Șterge utilizator</MenuItem>
          </Menu>
        </Box>

        <Box className={styles.actionBtnWrapper}>
          <Button variant="contained" color="primary" className={styles.assignBtn}>
            Asignează test
          </Button>
        </Box>
      </Box>
      <Box className={styles.cardWrapper}>
        <Tabs value={tab} onChange={handleTabChange} className={styles.tabs}>
          <Tab label="Informații" />
          <Tab label="Teste" />
        </Tabs>

        <Box className={styles.tabContent}>
          {tab === 0 && (
            <Box>
              <Typography className={styles.email}>{student.email}</Typography>
              <Typography className={styles.group}>Grupă: {student.group || "Neatribuit"}</Typography>
              <Typography className={styles.tests}>Teste efectuate: {student.tests.length}</Typography>
            </Box>
          )}
          {tab === 1 && (
            <Box className={styles.testsWrapper}>
              <TextField
                label="Caută test"
                variant="outlined"
                size="small"
                fullWidth
                className={styles.testSearch}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredTests.length === 0 ? (
                <Typography><em>Fără teste găsite</em></Typography>
              ) : (
                <List className={styles.testList}>
                  {filteredTests.map((test, i) => (
                    <ListItem key={i} className={styles.testItem}>
                      <ListItemText
                        primary={test}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Box>
      
    </div>
  );
};

export default StudentProfile;
