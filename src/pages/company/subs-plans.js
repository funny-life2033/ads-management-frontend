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
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { Axios } from "../../utils";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useSnackbar } from "notistack";
// import { FaCheck, FaTimes, FaRocket, FaCog, FaCrown } from "react-icons/fa";

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
        setIsLoading(false);
      });
  }, []);

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
        plans.map((plan) => ({ ...plan, isYourPlan: false }))
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
                    <PlanTitle variant="h4" align="center">
                      {plan.title}
                    </PlanTitle>
                    <PlanPrice variant="h3" align="center" color="primary">
                      {plan.price}
                      <Typography variant="subtitle1" component="span">
                        /month
                      </Typography>
                    </PlanPrice>
                    <PlanFeature>
                      <Typography variant="body1">
                        {plan.description}
                      </Typography>
                    </PlanFeature>
                    <PlanFeature>
                      <Typography variant="body1">
                        {plan.isPending
                          ? "Your last payment is on pending now"
                          : plan.nextPaymentDate
                            ? `Your next payment date is ${plan.nextPaymentDate}`
                            : `Your plan will end on ${plan.endDate}`}
                      </Typography>
                    </PlanFeature>
                  </Box>

                  {plan.isYourPlan ? (
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
