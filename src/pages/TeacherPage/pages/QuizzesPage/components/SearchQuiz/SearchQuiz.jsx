import React, { useState } from "react";
import {
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import styles from "./SearchQuiz.module.scss";

const SearchQuiz = ({ quizzes, setSelectedId }) => {
  const [search, setSearch] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.SearchQuizwrapp}>
      <Typography variant="h6" className={styles.title}>Quizzes</Typography>

      <TextField
        label="Search"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
        sx={{
          '& label': {
            color: '#ffcc80',
          },
          '& label.Mui-focused': {
            color: '#fb8c00',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderRadius: '12px',
              borderColor: '#ffcc80',
            },
            '&:hover fieldset': {
              borderRadius: '12px',
              borderColor: '#ffa726',
            },
            '&.Mui-focused fieldset': {
              borderRadius: '12px',
              borderColor: '#fb8c00',
            },
          },
        }}
      />

      <List className={styles.list}>
        {filteredQuizzes.map((quiz) => (
          <ListItem
            key={quiz.id}
            className={styles.listItem}
            onClick={() => setSelectedId(quiz.id)}
          >
            <ListItemText primary={quiz.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SearchQuiz;
