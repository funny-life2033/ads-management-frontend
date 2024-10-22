import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Tooltip,
  Fade,
} from "@mui/material";
import { styled } from "@mui/system";
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

const plans = [
  {
    title: "Basic",
    price: "$99",
    features: [
      "Social Media Management",
      "Content Creation (2 posts/week)",
      "Monthly Performance Report",
      "Email Support",
    ],
    // icon: <FaCog size={24} />,
    color: "#3f51b5",
  },
  {
    title: "Standard",
    price: "$199",
    features: [
      "Everything in Basic",
      "Content Creation (5 posts/week)",
      "SEO Optimization",
      "Ad Campaign Management",
      "Bi-weekly Strategy Call",
    ],
    // icon: <FaRocket size={24} />,
    color: "#f50057",
    ispopular: "true",
  },
  {
    title: "Premium",
    price: "$399",
    features: [
      "Everything in Standard",
      "Content Creation (Daily posts)",
      "Influencer Outreach",
      "Custom Website Development",
      "24/7 Priority Support",
    ],
    // icon: <FaCrown size={24} />,
    color: "#ff9100",
  },
];

const SubcriptionPlans = () => {
  // const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Choose the perfect plan to boost your online presence
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4, justifyContent: "center" }}>
        {plans.map((plan, index) => (
          <Fade
            in={true}
            style={{ transitionDelay: `${index * 100}ms` }}
            key={plan.title}
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
                        {plan.icon}
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
                    {plan.features.map((feature, idx) => (
                      <Tooltip
                        key={idx}
                        title={`Learn more about ${feature}`}
                        placement="top"
                        arrow
                      >
                        <PlanFeature>
                          {/* <FaCheck
                          color={plan.color}
                          style={{ marginRight: 8 }}
                        /> */}
                          <Typography variant="body1">{feature}</Typography>
                        </PlanFeature>
                      </Tooltip>
                    ))}
                  </Box>

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
                    aria-label={`Select ${plan.title} plan`}
                  >
                    Select Plan
                  </CtaButton>
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
