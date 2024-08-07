import { useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";

const subjects = ["Math", "Science", "History", "Geography"];
const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"];

const LandingPage = () => {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [attemptedQuestions, setAttemptedQuestions] = useState("");
  const [correctedQuestions, setCorrectedQuestions] = useState("");
  const [testNumber, setTestNumber] = useState(""); // New state for test number

  const [openSubjectForm, setOpenSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [openChapterForm, setOpenChapterForm] = useState(false);
  const [newChapter, setNewChapter] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Convert values to numbers
    const total = parseInt(totalQuestions, 10) || 0;
    const attempted = parseInt(attemptedQuestions, 10) || 0;
    const corrected = parseInt(correctedQuestions, 10) || 0;

    // Calculate percentages
    const attemptedPercentage = total > 0 ? ((attempted / total) * 100).toFixed(2) : 0;
    const correctedPercentage = total > 0 ? ((corrected / total) * 100).toFixed(2) : 0;

    // Log all the form data and percentages
    console.log({
      subject,
      chapter,
      totalQuestions,
      attemptedQuestions,
      correctedQuestions,
      testNumber, // Log the new test number
      attemptedPercentage: `${attemptedPercentage}%`,
      correctedPercentage: `${correctedPercentage}%`,
    });

    // Reset the form
    setSubject("");
    setChapter("");
    setTotalQuestions("");
    setAttemptedQuestions("");
    setCorrectedQuestions("");
    setTestNumber(""); // Reset the new field
  };

  const handleAddSubject = async () => {
    const token = Cookies.get("token");
    const response = await fetch("http://localhost:3030/api/subjects/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newSubject }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("New Subject added:", data);
      setOpenSubjectForm(false);
      setNewSubject("");
    } else {
      console.error("Failed to add subject:", await response.json());
    }
  };

  return (
    <>
      <Head>
        <title>Landing Page | Prep Pulse</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Typography variant="h3">Add Your Test Result</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Button
                startIcon={<AddIcon />}
                sx={{ width: "160px" }}
                onClick={() => setOpenSubjectForm(true)}
                variant="contained"
              >
                Add Subject
              </Button>
              <Button
                startIcon={<AddIcon />}
                sx={{ width: "160px" }}
                onClick={() => setOpenChapterForm(true)}
                variant="contained"
              >
                Add Chapter
              </Button>
            </Box>
            {openSubjectForm && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Add New Subject</Typography>
                <TextField
                  fullWidth
                  label="New Subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="contained" onClick={handleAddSubject}>
                  Submit Subject
                </Button>
              </Box>
            )}
            {openChapterForm && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Add New Chapter</Typography>
                <TextField
                  fullWidth
                  label="New Chapter"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log(`New Chapter: ${newChapter}`);
                    setOpenChapterForm(false);
                    setNewChapter("");
                  }}
                >
                  Submit Chapter
                </Button>
              </Box>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Select Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Select Chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                  >
                    {chapters.map((chapter) => (
                      <MenuItem key={chapter} value={chapter}>
                        {chapter}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total No. of Questions"
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Attempted Questions"
                    type="number"
                    value={attemptedQuestions}
                    onChange={(e) => setAttemptedQuestions(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Corrected Questions"
                    type="number"
                    value={correctedQuestions}
                    onChange={(e) => setCorrectedQuestions(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Test Number"
                    type="text"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

LandingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LandingPage;
