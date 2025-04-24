import React, { useState } from "react";
import {
  Typography, TextField, Select, MenuItem, List, ListItem, ListItemText, Avatar
} from "@mui/material";
import styles from "./StudentsSidebar.module.scss";

const StudentsSidebar = ({ students, selectedId, onSelectStudent }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filtered = students.filter((s) =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.email.includes(search)) &&
    (filter === "" || s.group === filter)
  );

  return (
    <div className={styles.sidebar}>
      <Typography variant="h6" className={styles.title}>Studenți</Typography>
      <TextField label="Caută" size="small" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} className={styles.search} />
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} displayEmpty size="small" fullWidth className={styles.filter}>
        <MenuItem value="">Toate grupele</MenuItem>
        <MenuItem value="A1">A1</MenuItem>
        <MenuItem value="B1">B1</MenuItem>
      </Select>
      <List className={styles.list}>
        {filtered.map((student) => (
          <ListItem
            button
            key={student.id}
            className={`${styles.listItem} ${student.id === selectedId ? styles.selected : ""}`}
            onClick={() => onSelectStudent(student.id)}
          >
            <Avatar src="/avatar.png" className={styles.avatar} />
            <ListItemText primary={student.name} secondary={student.email} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default StudentsSidebar;