import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-totalTest";
import { OverviewcorrectAccuracy } from "src/sections/overview/overview-correct-accuracy";
import { OverviewTotalQuestions } from "src/sections/overview/overview-total-questions";
import { OverviewTotalAttemptQuestions } from "src/sections/overview/overview-total-attempt-question";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { OverviewSales } from 'src/sections/overview/overview-sales';

import { getTestsDataByChapterId } from "src/utils/api";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const [totalTestCount, setTotalTestCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [correctedQuestions, setCorrectedQuestions] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [attemptAccuracy, setAttemptAccuracy] = useState(0);
  const [subjectName, setSubjectName] = useState("");
  const [chapterName, setChapterName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchTestsData = async () => {
      try {
        const token = Cookies.get("token");
        const testData = await getTestsDataByChapterId(id, token);
        // Set subject and chapter names
        setSubjectName(testData.testData[0].subjectName);
        setChapterName(testData.testData[0].chapterName);
        // Calculate sums
        const initialSums = {
          totalQuestions: 0,
          attemptedQuestions: 0,
          correctedQuestions: 0,
        };

        const sums = testData.testData.reduce((acc, test) => {
          return {
            totalQuestions: acc.totalQuestions + test.total_questions,
            attemptedQuestions: acc.attemptedQuestions + test.attempted_questions,
            correctedQuestions: acc.correctedQuestions + test.corrected_questions,
          };
        }, initialSums);

        const myAccuracy =
          sums.attemptedQuestions > 0
            ? Math.floor((sums.correctedQuestions / sums.attemptedQuestions) * 100)
            : 0;

        const myAttemptAccuracy =
          sums.totalQuestions > 0
            ? Math.floor((sums.attemptedQuestions / sums.totalQuestions) * 100)
            : 0;

        setTotalTestCount(testData.testData.length);
        setTotalQuestions(sums.totalQuestions);
        setAttemptedQuestions(sums.attemptedQuestions);
        setCorrectedQuestions(sums.correctedQuestions);
        setAccuracy(myAccuracy);
        setAttemptAccuracy(myAttemptAccuracy);
      } catch (error) {
        console.error("Failed to fetch test data by chapter ID:", error);
      }
    };

    fetchTestsData();
  }, [id]);

  return (
    <>
      <Head>
        <title>Overview | Prep Pulse</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {/* Breadcrumbs Component */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 4 }}>
            {/* <Link
              underline="hover"
              color="inherit"
              href="/"
            >
              Home
            </Link> */}
            <Typography color="text.primary">{subjectName}</Typography>
            <Typography color="text.primary">{chapterName}</Typography>
          </Breadcrumbs>

          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={totalTestCount}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalQuestions
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={String(totalQuestions)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalAttemptQuestions
                sx={{ height: "100%" }}
                value={String(attemptedQuestions)}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewcorrectAccuracy sx={{ height: "100%" }} value={accuracy} />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: 'Attempt Accuracy',
                    data: [attemptAccuracy]
                  },
                  {
                    name: 'Correct Accuracy',
                    data: [accuracy]
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
