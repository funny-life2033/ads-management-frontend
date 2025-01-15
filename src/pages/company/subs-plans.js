import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Fade,
  Backdrop,
  CircularProgress,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { Axios } from "../../utils/utils";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

const PlanCard = styled(Card)(({ theme, ispopular }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: theme.shadows[10],
  },
  ...(ispopular === "true" && {
    border: `2px solid ${theme.palette.secondary.main}`,
    "&::before": {
      content: "'Most Popular'",
      position: "absolute",
      top: "-12px",
      left: "50%",
      transform: "translateX(-50%)",
      background: theme.palette.secondary.main,
      color: theme.palette.common.white,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: "bold",
    },
  }),
}));

const PlanTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const PlanPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "2.5rem",
  marginBottom: theme.spacing(2),
}));

const PlanFeature = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const CtaButton = styled(Button)(({ theme }) => ({
  marginTop: "auto",
  fontWeight: "bold",
  padding: theme.spacing(1, 3),
}));

const SubcriptionPlans = ({ navigate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    Axios.get("/subscription", { withCredentials: true })
      .then(({ data }) => {
        setPlans(data.plans);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 403) {
          enqueueSnackbar("Your token is invalid or expired", {
            variant: "error",
          });
          return navigate("/authentication/login");
        }
        setIsLoading(false);
      });
  }, [enqueueSnackbar, navigate]);

  const goToCheckout = (productId) => {
    navigate(`/checkout:${productId}`);
  };

  const closePlan = async () => {
    setIsClosing(true);
    try {
      await Axios.delete("subscription", { withCredentials: true });
      enqueueSnackbar("Successfully cancelled", {
        variant: "success",
      });
      setPlans((plans) =>
        plans.map((plan) => ({
          ...plan,
          isYourPlan: false,
          nextPaymentDate: null,
          endDate: null,
          isPending: null,
        }))
      );
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
      else enqueueSnackbar("Server error!", { variant: "error" });
    }
    setIsClosing(false);
  };

  const handleTitleChange = (planId, newValue) => {
    setPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId ? { ...plan, title: newValue, editted: true } : plan
      )
    );
  };

  const handlePriceChange = (planId, newValue) => {
    setPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId ? { ...plan, price: newValue, editted: true } : plan
      )
    );
  };

  const handleDescriptionChange = (planId, newValue) => {
    setPlans((plans) =>
      plans.map((plan) =>
        plan.id === planId
          ? { ...plan, description: newValue, editted: true }
          : plan
      )
    );
  };

  const applyChange = async (planId) => {
    const plan = plans.find((plan) => plan.id === planId);
    if (plan) {
      setIsLoading(true);
      try {
        const res = await Axios.post(
          `/product/${planId}`,
          {
            title: plan.title,
            price: plan.price,
            description: plan.description,
          },
          { withCredentials: true }
        );
        enqueueSnackbar(res.data.message, {
          variant: "success",
        });
        setPlans((plans) =>
          plans.map((plan) =>
            plan.id === planId ? { ...plan, editted: null } : plan
          )
        );
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
        else enqueueSnackbar("Server error!", { variant: "error" });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading || isClosing}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose the perfect plan to boost your online presence
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4, justifyContent: "center" }}>
        {plans.map((plan, index) => (
          <Fade
            in={true}
            style={{ transitionDelay: `${index * 100}ms` }}
            key={plan.id}
          >
            <Grid item xs={12} md={4} minWidth={350}>
              <PlanCard
                ispopular={plan.ispopular}
                // onMouseEnter={() => setHoveredPlan(index)}
                // onMouseLeave={() => setHoveredPlan(null)}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                    >
                      <Box
                        sx={{
                          bgcolor: plan.color,
                          color: "white",
                          borderRadius: "50%",
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <RocketLaunchIcon style={{ fontSize: 24 }} />
                      </Box>
                    </Box>
                    <PlanTitle
                      variant="h4"
                      align={
                        Cookies.get("isAdmin") === "true" ? "left" : "center"
                      }
                    >
                      {Cookies.get("isAdmin") === "true" ? (
                        <TextField
                          value={plan.title}
                          label="Plan Title"
                          variant="standard"
                          onChange={(e) =>
                            handleTitleChange(plan.id, e.target.value)
                          }
                        />
                      ) : (
                        plan.title
                      )}
                    </PlanTitle>
                    <PlanPrice
                      variant="h3"
                      align={
                        Cookies.get("isAdmin") === "true" ? "left" : "center"
                      }
                      color="primary"
                    >
                      {Cookies.get("isAdmin") === "true" ? (
                        <TextField
                          value={parseInt(plan.price)}
                          label="Plan Price"
                          variant="standard"
                          type="number"
                          onChange={(e) =>
                            handlePriceChange(plan.id, e.target.value)
                          }
                        />
                      ) : (
                        plan.price
                      )}
                      <Typography variant="subtitle1" component="span">
                        /month
                      </Typography>
                    </PlanPrice>
                    <PlanFeature>
                      <Typography variant="body1" sx={{ width: "100%" }}>
                        {Cookies.get("isAdmin") === "true" ? (
                          <TextField
                            value={plan.description}
                            label="Plan Description"
                            variant="standard"
                            fullWidth
                            onChange={(e) =>
                              handleDescriptionChange(plan.id, e.target.value)
                            }
                          />
                        ) : (
                          plan.description
                        )}
                      </Typography>
                    </PlanFeature>
                    <PlanFeature>
                      <Typography variant="body1">
                        {plan.isYourPlan
                          ? plan.isPending
                            ? "Your last payment is on pending now"
                            : plan.nextPaymentDate
                              ? `Your next payment date is ${plan.nextPaymentDate}`
                              : plan.endDate
                                ? `Your plan will end on ${plan.endDate}`
                                : ""
                          : ""}
                      </Typography>
                    </PlanFeature>
                    <PlanFeature>
                      <Typography variant="body1">
                        {plan.isYourPlan
                          ? plan.isPending
                            ? "Your ads will be live when your payment has been processed, within approximately 24 hours."
                            : ""
                          : ""}
                      </Typography>
                    </PlanFeature>
                  </Box>

                  {Cookies.get("isAdmin") === "true" ? (
                    <CtaButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{
                        mt: 4,
                        bgcolor: plan.color,
                        "&:hover": {
                          bgcolor: plan.color,
                          filter: "brightness(90%)",
                        },
                      }}
                      disabled={isLoading || !plan.editted}
                      onClick={() => applyChange(plan.id)}
                    >
                      Save
                    </CtaButton>
                  ) : plan.isYourPlan ? (
                    <>
                      <CtaButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={true}
                        sx={{
                          mt: 4,
                          bgcolor: plan.color,
                          "&:hover": {
                            bgcolor: plan.color,
                            filter: "brightness(90%)",
                          },
                        }}
                      >
                        Your plan
                      </CtaButton>
                      <CtaButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{
                          mt: 1,
                          bgcolor: plan.color,
                          "&:hover": {
                            bgcolor: plan.color,
                            filter: "brightness(90%)",
                          },
                        }}
                        disabled={isLoading || isClosing}
                        onClick={closePlan}
                      >
                        Close this plan
                      </CtaButton>
                    </>
                  ) : (
                    <CtaButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{
                        mt: 4,
                        bgcolor: plan.color,
                        "&:hover": {
                          bgcolor: plan.color,
                          filter: "brightness(90%)",
                        },
                      }}
                      disabled={isLoading || isClosing}
                      aria-label={`Select ${plan.title} plan`}
                      onClick={() => goToCheckout(plan.id)}
                    >
                      Select Plan
                    </CtaButton>
                  )}
                </CardContent>
              </PlanCard>
            </Grid>
          </Fade>
        ))}
      </Grid>
    </Container>
  );
};

export default SubcriptionPlans;
