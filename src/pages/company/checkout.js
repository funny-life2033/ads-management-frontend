import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EditIcon from "@mui/icons-material/Edit";
import { Axios } from "../../utils/utils";
import { useSnackbar } from "notistack";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
}));

const StyledTextField = styled(TextField)(({ error }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: error ? "#f44336" : "rgba(0, 0, 0, 0.23)",
  },
}));

const SubmitButton = styled(Button)({
  padding: "12px 32px",
  borderRadius: "8px",
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
});

const Checkout = ({ productId, navigate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Axios.get("/subscription/check", { withCredentials: true })
      .then((res) => {
        const { product, paymentInfo } = res.data;

        if (productId === product.id) {
          enqueueSnackbar("You are already in the plan!", {
            variant: "error",
          });
          navigate("/plans");
        } else {
          const formData = {
            ...paymentInfo,
            expiryDate:
              paymentInfo.expiryDate &&
              paymentInfo.expiryDate !== "" &&
              `${paymentInfo.expiryDate.split("-")[1].padStart(2, "0")}/${paymentInfo.expiryDate.split("-")[0].slice(-2)}`,
          };
          setFormData({ ...formData });
          setInitialFormData({ ...formData });
        }

        setIsLoading(false);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.paymentInfo
        ) {
          const paymentInfo = error.response.data.paymentInfo;
          const formData = {
            ...paymentInfo,
            expiryDate:
              paymentInfo.expiryDate &&
              paymentInfo.expiryDate !== "" &&
              `${paymentInfo.expiryDate.split("-")[1].padStart(2, "0")}/${paymentInfo.expiryDate.split("-")[0].slice(-2)}`,
          };
          setFormData({ ...formData });
          setInitialFormData({ ...formData });
        }
        setIsLoading(false);
      });
  }, [enqueueSnackbar, navigate, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return;
    }

    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(.{2})/, "$1/");
      if (formattedValue.length > 5) return;
    }

    setFormData({ ...formData, [name]: formattedValue });
    validateField(name, formattedValue);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "cardNumber":
        if (value.startsWith("XXXX")) {
          delete newErrors.cardNumber;
        } else if (value.replace(/\s/g, "").length !== 16) {
          newErrors.cardNumber = "Invalid card number";
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case "expiryDate":
        const [month, year] = value.split("/");
        if (!month || !year || month > 12 || month < 1) {
          newErrors.expiryDate = "Invalid expiration date";
        } else {
          delete newErrors.expiryDate;
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[name] = "This field is required";
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const validateFields = () => {
    const newErrors = { ...errors };

    for (let key of Object.keys(formData)) {
      switch (key) {
        case "cardNumber":
          if (formData[key].startsWith("XXXX")) {
            delete newErrors.cardNumber;
          } else if (formData[key].replace(/\s/g, "").length !== 16) {
            newErrors.cardNumber = "Invalid card number";
          } else {
            delete newErrors.cardNumber;
          }
          break;
        case "expiryDate":
          const [month, year] = formData[key].split("/");
          if (!month || !year || month > 12 || month < 1) {
            newErrors.expiryDate = "Invalid expiration date";
          } else {
            delete newErrors.expiryDate;
          }
          break;
        default:
          if (!formData[key].trim()) {
            newErrors[key] = "This field is required";
          } else {
            delete newErrors[key];
          }
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const errors = validateFields();

    if (Object.keys(errors).length === 0) {
      try {
        await Axios.post(
          "/subscription",
          {
            productId,
            paymentInfo:
              JSON.stringify(formData) === JSON.stringify(initialFormData)
                ? null
                : {
                    ...formData,
                    cardNumber: formData.cardNumber
                      ? formData.cardNumber.replaceAll(" ", "")
                      : "",
                  },
          },
          { withCredentials: true }
        );

        enqueueSnackbar("Successfully purchased!", {
          variant: "success",
        });
        navigate("/dashboard");
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
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress size={40} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper elevation={0}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            <CreditCardIcon
              style={{ marginRight: "12px", verticalAlign: "middle" }}
            />
            Secure Checkout
          </Typography>

          <Grid container spacing={3}>
            {formData.cardNumber && formData.cardNumber.startsWith("XXXX") ? (
              <Grid item xs={12}>
                CreditCard info: {formData.cardNumber} {formData.expiryDate}{" "}
                <IconButton
                  onClick={() =>
                    setFormData((data) => ({ ...data, cardNumber: "" }))
                  }
                >
                  <EditIcon />
                </IconButton>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    inputProps={{ "aria-label": "Card Number" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Expiry Date (MM/YY)"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    inputProps={{ "aria-label": "Expiry Date" }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              Billing Address
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                inputProps={{ "aria-label": "First Name" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                inputProps={{ "aria-label": "Last Name" }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                inputProps={{ "aria-label": "Address" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                inputProps={{ "aria-label": "City" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
                inputProps={{ "aria-label": "State" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                inputProps={{ "aria-label": "ZIP Code" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
                inputProps={{ "aria-label": "Country" }}
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Order"
                )}
              </SubmitButton>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Checkout;
