import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import axios from "axios";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      mobile: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      mobile: Yup.string().max(255).required("Mobile number is required"),
      name: Yup.string().max(255).required("Name is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await axios.post("https://prep-pulse.onrender.com/api/users/register", {
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
        });
        // console.log(response.data);
        // Assuming the API returns a token and user information
        const token = response.data.token;
        const user = response.data.user;
        // console.log("Token is: ", token);
        // console.log("User is: ", user);

        // Call your authentication hook's signIn method
        if (user) {
          await auth.signUp(token, user);
          router.push("/");
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.data.message });
          helpers.setSubmitting(false);
        }

        // Redirect to home page
      } catch (err) {
        // console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Prep Pulse</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.mobile && formik.errors.mobile)}
                  fullWidth
                  helperText={formik.touched.mobile && formik.errors.mobile}
                  label="Mobile Number"
                  name="mobile"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.mobile}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
