import { useState } from "react";
import {
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import styles from "./StudentsSidebar.module.scss";

const StudentsSidebar = ({ students, selectedId, onSelectStudent }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.sidebar}>
      <Typography variant="h6" className={styles.title}>Students</Typography>
      <TextField
        placeholder="Search"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: '12px',
            },
            '&:hover fieldset': {
              borderRadius: '12px',
              borderColor: '#ffa726',
            },
            '&.Mui-focused fieldset': {
              borderRadius: '12px',
              borderColor: '#fb8c00',
            },
            '& .MuiInputBase-input': {
              fontSize: '20px',
            },
          },
        }}
      />
      <List className={styles.list}>
        {filteredStudents.map((student) => (
          <ListItem
            button
            key={student.id}
            className={`${styles.listItem} ${student.id === selectedId ? styles.selected : ""}`}
            onClick={() => onSelectStudent(student.id)}
          >
            <Avatar alt={student.name} src="/avatar.png" className={styles.avatar} />
            <ListItemText primary={student.name} secondary={student.email} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default StudentsSidebar;
