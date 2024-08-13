import { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { fetchSubjects, fetchChapters } from "src/utils/api"; // Replace with actual import

const Page = () => {
  const [subjects, setSubjects] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const userId = Cookies.get("userId");
        const token = Cookies.get("token");
        const subjectsData = await fetchSubjects(userId, token);
        setSubjects(subjectsData.map(subject => ({
          ...subject,
          chapters: [], // Initialize with empty chapters
        })));
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    getSubjects();
  }, []);

  const handleAccordionChange = async (subjectId) => {
    setExpanded((prev) => (prev === subjectId ? false : subjectId));

    if (expanded !== subjectId) {
      const subject = subjects.find(sub => sub.id === subjectId);
      
      // Check if chapters are already loaded
      if (subject && subject.chapters.length === 0) {
        setLoading(subjectId);
        try {
          const token = Cookies.get("token");
          const chapters = await fetchChapters(subjectId, token);
          const updatedSubjects = subjects.map((sub) =>
            sub.id === subjectId ? { ...sub, chapters } : sub
          );
          setSubjects(updatedSubjects);
        } catch (error) {
          console.error("Failed to fetch chapters:", error);
        } finally {
          setLoading(null);
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>Subjects | Prep-Pulse</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Subjects</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={<ExpandMoreIcon />}
                  variant="contained"
                >
                  Add Subject
                </Button>
              </div>
            </Stack>

            {subjects.map((subject) => (
              <Accordion
                key={subject.id}
                expanded={expanded === subject.id}
                onChange={() => handleAccordionChange(subject.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${subject.id}-content`}
                  id={`panel-${subject.id}-header`}
                >
                  <Typography>{subject.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {loading === subject.id ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {subject.chapters?.length > 0 ? (
                        <Stack spacing={2}>
                          {subject.chapters.map((chapter) => (
                            <Stack
                              key={chapter.id}
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography>{chapter.name}</Typography>
                              <Link
                                href={`/viewChapterwiseStats?id=${chapter.id}`}
                                passHref
                              >
                                <Button
                                  variant="outlined"
                                  sx={{
                                    height: '24px', // Reduced height
                                    borderRadius: '4px', // Added border radius
                                  }}
                                >
                                  View Stats
                                </Button>
                              </Link>
                            </Stack>
                          ))}
                        </Stack>
                      ) : (
                        <Typography>No chapters available.</Typography>
                      )}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
