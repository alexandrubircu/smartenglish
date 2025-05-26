import React, { useState } from "react";
import {
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import styles from "./SearchQuiz.module.scss";

const SearchQuiz = ({ quizzes, setSelectedId, selectedId}) => {
  const [search, setSearch] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.SearchQuizwrapp}>
      <Typography variant="h6" className={styles.title}>Quizzes</Typography>

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
        {!filteredQuizzes || filteredQuizzes.length === 0 ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <ListItem
              key={quiz.id}
              className={`${styles.listItem} ${selectedId === quiz.id ? styles.selected : ''}`}
              onClick={() => setSelectedId(quiz.id)}
            >
              <ListItemText primary={quiz.title} />
            </ListItem>

          ))
        )}
      </List>
    </div>
  );
};

export default SearchQuiz;
