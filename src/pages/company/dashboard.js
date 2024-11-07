import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Axios } from "../../utils/utils";
import { useSnackbar } from "notistack";

const AdSetupForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
  position: "relative",
}));

const FormField = styled(TextField)(({ theme, error }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: error ? theme.palette.error.main : theme.palette.grey[300],
      borderRadius: theme.shape.borderRadius,
    },
    "&:hover fieldset": {
      borderColor: error
        ? theme.palette.error.main
        : theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: error
        ? theme.palette.error.main
        : theme.palette.primary.main,
    },
  },
}));

const DragDropArea = styled(Box)(({ theme, isDragging }) => ({
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  // marginTop: theme.spacing(2),
  padding: theme.spacing(1, 4),
  fontWeight: "bold",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
}));

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [adData, setAdData] = useState({
    banner: null,
    title: "",
    description: "",
    link: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isAlreadySetup, setIsAlreadySetup] = useState(false);

  useEffect(() => {
    Axios.get("/ads", { withCredentials: true })
      .then((res) => {
        const { banner, title, description, link } = res.data;
        if (!banner) setIsAlreadySetup(false);
        else setIsAlreadySetup(true);
        setAdData({
          banner,
          title: title || "",
          description: description || "",
          link: link || "",
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const getBase64 = async (file) => {
    return new Promise((res, err) => {
      if (!file.type || !file.type.startsWith("image/")) err("");
      const reader = new FileReader();
      reader.onloadend = () => {
        res(reader.result);
      };
      reader.onerror = () => {
        err(reader.error);
      };
      const blob = new Blob([file], { type: file.type });
      reader.readAsDataURL(blob);
    });
  };

  const htmlContent = () => {
    const src =
      adData.banner instanceof File
        ? URL.createObjectURL(adData.banner)
        : typeof adData.banner === "string"
          ? adData.banner
          : "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80";
    const title =
      adData.title && adData.title !== "" ? adData.title : "Smart Ad Title";
    const description =
      adData.description && adData.description !== ""
        ? adData.description
        : "This is a brief description of the smart advertisement. It showcases the product or service being promoted.";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Ads Section</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" id="adSection">
        <div class="md:flex">
            <div class="md:flex-shrink-0">
                <img class="h-48 w-full object-cover md:w-48" src="${src}" alt="Smart advertisement image" id="adImage">
            </div>
            <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-[#F79518] font-semibold" id="adTitle">${title}</div>
                <p class="mt-2 text-gray-500" id="adDescription">${description}</p>
                <div class="mt-4">
                    <button href="#" class="inline-block px-4 py-2 leading-none border rounded text-[#F79518] border-[#F79518] hover:text-white hover:bg-[#F79518] transition-colors duration-300" id="adButton">Learn More</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
    validateField(name, value);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setAdData({ ...adData, banner: file });
      setErrors({ ...errors, banner: "" });
    } else {
      setErrors({ ...errors, banner: "Please upload a valid image file." });
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setAdData({ ...adData, banner: file });
      setErrors({ ...errors, banner: "" });
    } else {
      setErrors({ ...errors, banner: "Please upload a valid image file." });
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        if (value.length > 200)
          error = "Description must be 200 characters or less";
        break;
      case "link":
        if (!value.trim()) error = "Link is required";
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(value))
          error = "Please enter a valid URL";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors = {};
    // if (!adData.banner) newErrors.banner = "Banner image is required";
    if (!adData.title.trim()) newErrors.title = "Title is required";
    if (!adData.description.trim())
      newErrors.description = "Description is required";
    if (!adData.link.trim()) newErrors.link = "Link is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      const uploadingData = {
        ...adData,
        banner: adData.banner
          ? {
              base64: null,
              type: adData.banner.type,
            }
          : null,
      };
      if (
        adData.banner &&
        adData.banner.type &&
        adData.banner.type.startsWith("image/")
      )
        uploadingData.banner.base64 = await getBase64(adData.banner);
      else uploadingData.banner = null;
      try {
        await Axios.post("/ads/submit", uploadingData, {
          withCredentials: true,
        });
        enqueueSnackbar("Successfully submitted!", {
          variant: "success",
        });
        setIsAlreadySetup(true);
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        )
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
        else
          enqueueSnackbar("Server error!", {
            variant: "error",
          });
      }
      setErrors({});
      setIsLoading(false);
    }
  };

  const reset = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await Axios.get("/ads/reset", { withCredentials: true });
      setAdData({ banner: null, title: "", description: "", link: "" });
      setIsAlreadySetup(false);
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      else
        enqueueSnackbar("Server error!", {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  return (
    <AdSetupForm component="form" onSubmit={handleSubmit}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h4" gutterBottom>
        Set Up Your Ad
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <iframe
            srcDoc={htmlContent()}
            width="100%"
            height="100%"
            title="Iframe with Script"
            style={{ border: "none" }}
          ></iframe>
        </Grid>
        <Grid item xs={12} md={6}>
          <DragDropArea
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: "none" }}
              id="banner-upload"
              value={
                adData.banner && adData.banner instanceof File
                  ? adData.banner
                  : null
              }
            />
            <label htmlFor="banner-upload">
              <Box display="flex" flexDirection="column" alignItems="center">
                <FileUploadIcon style={{ color: "#757575", fontSize: 48 }} />
                <Typography variant="body1" mt={2}>
                  {adData.banner && adData.banner.name
                    ? adData.banner.name
                    : "Drag & Drop or Click to Upload Banner"}
                </Typography>
              </Box>
            </label>
          </DragDropArea>
          {errors.banner && <ErrorText>{errors.banner}</ErrorText>}
          <br />
          <FormField
            fullWidth
            label="Title"
            name="title"
            value={adData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            inputProps={{ "aria-label": "Title" }}
          />
          <FormField
            fullWidth
            label="Description"
            name="description"
            value={adData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={
              errors.description
                ? errors.description
                : `${adData.description.length}/200`
            }
            multiline
            rows={4}
            inputProps={{ "aria-label": "Description", maxLength: 200 }}
          />
          <FormField
            fullWidth
            label="Link"
            name="link"
            value={adData.link}
            onChange={handleInputChange}
            error={!!errors.link}
            helperText={errors.link}
            inputProps={{ "aria-label": "Link" }}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <SubmitButton
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          startIcon={<FileUploadIcon />}
        >
          Submit
        </SubmitButton>
        {isAlreadySetup && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            disabled={isLoading}
            onClick={reset}
          >
            Reset
          </Button>
        )}
      </Box>
    </AdSetupForm>
  );
};

export default Dashboard;
