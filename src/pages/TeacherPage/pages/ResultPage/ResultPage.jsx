import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  TextareaAutosize,
} from "@mui/material";
import {
  fetchCompletedTestByStudent,
  markNotificationAsRead,
} from "../../../../api/teacherService";

const ResultPage = () => {
  const { studentId, completedTestId, notifId } = useParams();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [copyText, setCopyText] = useState("");

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

  const handleOpenDialog = () => {
    if (!testData) return;

    let content = `🌟 Test: ${testData.quizName} 🌟\nElev: ${testData.studentName}\n\n`;

    testData.answersQuestion?.forEach((item, index) => {
      const isCorrect = item.correct ? "✅ Corect" : "❌ Greșit";
      content += `${index + 1}. ${item.question}\n   ➡️ ${item.userAnswer || "-"}  ${isCorrect}\n`;
      if (!item.correct && item.correctTextAnswers?.length > 0) {
        content += `   ✅ Răspunsuri corecte: ${item.correctTextAnswers.join(", ")}\n`;
      }
      content += `\n`;
    });

    setCopyText(content);
    setOpenDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
  };

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
        {testData.answersQuestion?.map((item, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography fontWeight="bold">{index + 1}. {item.question}</Typography>
            <Typography color={item.correct ? "green" : "red"}>
              Răspuns elev: {item.userAnswer || "-"} ({item.correct ? "corect" : "greșit"})
            </Typography>
            {!item.correct && item.correctTextAnswers?.length > 0 && (
              <Typography variant="body2">
                Răspunsuri corecte: {item.correctTextAnswers.join(", ")}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Button variant="outlined" sx={{ mt: 3 }} onClick={handleOpenDialog}>
        Copiază rezultatul
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography variant="h6">Rezumat test</Typography>
          <TextareaAutosize
            minRows={10}
            style={{ width: "100%", marginTop: 10 }}
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Închide</Button>
            <Button onClick={copyToClipboard} variant="contained">Copiază</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ResultPage;
