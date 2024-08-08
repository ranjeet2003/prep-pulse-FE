import React, { useState, useEffect } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-totalTest";
// import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
// import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
// import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewcorrectAccuracy } from "src/sections/overview/overview-correct-accuracy";
import { OverviewTotalQuestions } from "src/sections/overview/overview-total-questions";
import { OverviewTotalAttemptQuestions } from "src/sections/overview/overview-total-attempt-question";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { getTotalTestCountByUser } from "src/utils/api";
import Cookies from "js-cookie";

const now = new Date();

const Page = () => {
  const [totalTestCount, setTotalTestCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [correctedQuestions, setCorrectedQuestions] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [attemptAccuracy, setAttemptAccuracy] = useState(0);

  useEffect(() => {
    const fetchTotalTestCount = async () => {
      try {
        const userId = Cookies.get("userId"); // Replace with actual user ID
        const token = Cookies.get("token"); // Replace with actual token

        const totalTestCountData = await getTotalTestCountByUser(userId, token);
        console.log("totalTestCountData: ", totalTestCountData);

        // Calculate sums
        const initialSums = {
          totalQuestions: 0,
          attemptedQuestions: 0,
          correctedQuestions: 0,
        };

        const sums = totalTestCountData.testCount.reduce((acc, test) => {
          return {
            totalQuestions: acc.totalQuestions + test.total_questions,
            attemptedQuestions: acc.attemptedQuestions + test.attempted_questions,
            correctedQuestions: acc.correctedQuestions + test.corrected_questions,
          };
        }, initialSums);

        // Calculate accuracies
        const myAccuracy =
          sums.attemptedQuestions > 0
            ? Math.floor((sums.correctedQuestions / sums.attemptedQuestions) * 100)
            : 0;

        const myAttemptAccuracy =
          sums.totalQuestions > 0
            ? Math.floor((sums.attemptedQuestions / sums.totalQuestions) * 100)
            : 0;

        // Set state values
        setTotalTestCount(totalTestCountData.testCount.length);
        setTotalQuestions(sums.totalQuestions);
        setAttemptedQuestions(sums.attemptedQuestions);
        setCorrectedQuestions(sums.correctedQuestions);
        setAccuracy(myAccuracy);
        setAttemptAccuracy(myAttemptAccuracy);
      } catch (error) {
        console.error("Failed to fetch total test count:", error);
      }
    };

    fetchTotalTestCount();
  }, []);

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
            <Grid xs={12} md={6} lg={6}>
              <OverviewTraffic
                chartSeries={[accuracy, attemptAccuracy]} // Adjust the values as per your requirement
                labels={["Correct Accuracy", "Attempt Accuracy", "Other"]}
                sx={{ height: "100%" }}
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
