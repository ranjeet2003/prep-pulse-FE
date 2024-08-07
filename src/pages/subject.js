import { useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const handleSubjectSubmit = (event) => {
    event.preventDefault();
    // Handle subject form submission
    console.log("Subject: ", subject);
    setSubject("");
    setShowSubjectForm(false);
  };

  const handleChapterSubmit = (event) => {
    event.preventDefault();
    // Handle chapter form submission
    console.log("Chapter: ", chapter);
    setChapter("");
    setShowChapterForm(false);
  };

  return (
    <>
      <Head>
        <title>Subjects & Chapters | Prep Pulse</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Manage Subjects & Chapters</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={3}>
              <Card
                sx={{ width: "100%", cursor: "pointer" }}
                onClick={() => setShowSubjectForm(!showSubjectForm)}
              >
                <CardContent>
                  <Typography variant="h5">Add Subject</Typography>
                </CardContent>
              </Card>
              <Card
                sx={{ width: "100%", cursor: "pointer" }}
                onClick={() => setShowChapterForm(!showChapterForm)}
              >
                <CardContent>
                  <Typography variant="h5">Add Chapter</Typography>
                </CardContent>
              </Card>
            </Stack>
            {showSubjectForm && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <form onSubmit={handleSubjectSubmit}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Subject Name"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            )}
            {showChapterForm && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <form onSubmit={handleChapterSubmit}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Chapter Name"
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
                      />
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
