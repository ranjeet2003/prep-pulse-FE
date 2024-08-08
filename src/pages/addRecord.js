import { useState, useEffect } from "react";
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import { fetchSubjects, fetchChapters, addSubject, addTest, addChapter } from "src/utils/api";
import { useRouter } from "next/router";

const LandingPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [subjectsError, setSubjectsError] = useState("");
  const [chaptersError, setChaptersError] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [attemptedQuestions, setAttemptedQuestions] = useState("");
  const [correctedQuestions, setCorrectedQuestions] = useState("");
  const [testNumber, setTestNumber] = useState("");

  const [openSubjectForm, setOpenSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [openChapterForm, setOpenChapterForm] = useState(false);
  const [newChapter, setNewChapter] = useState("");
  const [newlyAddedSubjectId, setNewlyAddedSubjectId] = useState("");
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const total = parseInt(totalQuestions, 10) || 0;
    const attempted = parseInt(attemptedQuestions, 10) || 0;
    const corrected = parseInt(correctedQuestions, 10) || 0;

    const attemptedPercentage = total > 0 ? ((attempted / total) * 100).toFixed(2) : 0;
    const correctedPercentage = total > 0 ? ((corrected / total) * 100).toFixed(2) : 0;

    console.log({
      subject,
      chapter,
      totalQuestions,
      attemptedQuestions,
      correctedQuestions,
      testNumber,
      attemptedPercentage: `${attemptedPercentage}%`,
      correctedPercentage: `${correctedPercentage}%`,
    });

    // Prepare the data to be sent to the API
    const testData = {
      chapterId: chapter,
      test_number: parseInt(testNumber, 10),
      total_questions: total,
      attempted_questions: attempted,
      corrected_questions: corrected,
      userId: Cookies.get("userId"),
    };

    try {
      const token = Cookies.get("token");
      await addTest(testData, token);

      // Show success message and redirect after 3 seconds
      setSuccessSnackbarOpen(true);
      setTimeout(() => {
        router.push("/");
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddSubject = async () => {
    const token = Cookies.get("token");

    try {
      const data = await addSubject(newSubject, token);
      console.log("New Subject added:", data);
      setNewlyAddedSubjectId(data.id); // Store the subject ID returned by the API
      setOpenSubjectForm(false);
      setNewSubject("");
      fetchSubjectsList(); // Refresh the subjects list
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddChapter = async () => {
    const token = Cookies.get("token");

    try {
      const chapterData = {
        name: newChapter,
        subjectId: newlyAddedSubjectId || subject,
      };
      const data = await addChapter(chapterData.name, chapterData.subjectId, token);
      console.log("New Chapter added:", data);
      setOpenChapterForm(false);
      setNewChapter("");
      fetchChaptersList(chapterData.subjectId); // Optionally refresh the chapters list
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchSubjectsList = async () => {
    setLoadingSubjects(true);
    setSubjectsError("");
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    try {
      const data = await fetchSubjects(userId, token);
      if (data.length === 0) {
        setSubjectsError("No subjects found. Please add one.");
      }
      setSubjects(data);
    } catch (error) {
      setSubjectsError(error.message);
    }
    setLoadingSubjects(false);
  };

  const fetchChaptersList = async (subjectId) => {
    setLoadingChapters(true);
    setChaptersError("");
    const token = Cookies.get("token");

    try {
      const data = await fetchChapters(subjectId, token);
      if (data.length === 0) {
        setChaptersError("No chapters found for this subject.");
      }
      setChapters(data);
    } catch (error) {
      setChaptersError(error.message);
    }
    setLoadingChapters(false);
  };

  const handleSubjectChange = (event) => {
    const selectedSubjectId = event.target.value;
    setSubject(selectedSubjectId);
    fetchChaptersList(selectedSubjectId);
  };

  useEffect(() => {
    fetchSubjectsList();
  }, []);

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
                justifyContent: "space-between", // Align buttons parallel to each other
                gap: 2, // Add space between the buttons
                mb: 2,
              }}
            >
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  sx={{ width: "160px" }}
                  onClick={() => setOpenSubjectForm((prev) => !prev)}
                  variant="contained"
                >
                  Add Subject
                </Button>
                {openSubjectForm && (
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddSubject();
                    }}
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      fullWidth
                      label="New Subject"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Box>
                )}
              </Box>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  sx={{ width: "160px" }}
                  onClick={() => setOpenChapterForm((prev) => !prev)}
                  variant="contained"
                >
                  Add Chapter
                </Button>
                {openChapterForm && (
                  <Box
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddChapter();
                    }}
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      fullWidth
                      label="New Chapter"
                      value={newChapter}
                      onChange={(e) => setNewChapter(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Select Subject"
                    value={subject}
                    onChange={handleSubjectChange}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 224, // 5 items * 48px item height + 8px padding
                          },
                        },
                      },
                    }}
                  >
                    {loadingSubjects ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} />
                      </MenuItem>
                    ) : subjectsError ? (
                      <MenuItem disabled>{subjectsError}</MenuItem>
                    ) : (
                      subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Select Chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 224, // 5 items * 48px item height + 8px padding
                          },
                        },
                      },
                    }}
                  >
                    {loadingChapters ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} />
                      </MenuItem>
                    ) : chaptersError ? (
                      <MenuItem disabled>{chaptersError}</MenuItem>
                    ) : (
                      chapters.map((chapter) => (
                        <MenuItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </MenuItem>
                      ))
                    )}
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
                    type="number"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Box>
            </form>
          </Stack>
        </Container>
      </Box>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbarOpen(false)}
      >
        <Alert onClose={() => setSuccessSnackbarOpen(false)} severity="success">
          Test data added successfully
        </Alert>
      </Snackbar>
    </>
  );
};

LandingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LandingPage;
