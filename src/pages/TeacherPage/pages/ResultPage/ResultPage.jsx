import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  fetchCompletedTestByStudent,
  markNotificationAsRead,
} from "../../../../api/teacherService";

const ResultPage = () => {
  const { studentId, completedTestId, notifId } = useParams();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const data = await fetchCompletedTestByStudent(studentId, completedTestId);
        setTestData(data);

        if (notifId) {
          await markNotificationAsRead(notifId);
        }
      } catch (err) {
        console.error("❌", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [studentId, completedTestId, notifId]);

  if (loading) return <CircularProgress />;
  if (!testData) return <Typography>Testul nu a fost găsit.</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">Rezultat Test</Typography>
      <Typography variant="subtitle1">Elev: {testData.studentName}</Typography>
      <Typography variant="body1">Test: {testData.quizName}</Typography>
      <Typography variant="body1">
        Finalizat la: {new Date(testData.completedAt).toLocaleString()}
      </Typography>

      <Box mt={3}>
        <Typography variant="h6">Răspunsuri:</Typography>
        {testData.answersQuestion?.map((answer, index) => (
          <Typography
            key={index}
            sx={{
              color: answer.correct ? "green" : "red",
              fontWeight: answer.correct ? 600 : 400,
            }}
          >
            {index + 1}. {answer.question} – {answer.correct ? "✅ Corect" : "❌ Greșit"}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ResultPage;
