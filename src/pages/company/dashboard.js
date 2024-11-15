import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Switch,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { Axios } from "../../utils/utils";
import { useSnackbar } from "notistack";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "12px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const Dashboard = ({ navigate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Axios.get("/ads", { withCredentials: true })
      .then((res) => {
        const { ads } = res.data;
        setAds(ads);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response && err.response.status === 403) {
          enqueueSnackbar("Your token is invalid or expired", {
            variant: "error",
          });
          return navigate("/authentication/login");
        }
      });
  }, [enqueueSnackbar, navigate]);

  const handleDelete = (id) => {
    setIsLoading(true);
    Axios.delete(`/ads/${id}`, { withCredentials: true })
      .then((res) => {
        enqueueSnackbar("Successfully deleted!", {
          variant: "success",
        });

        setAds((ads) => ads.filter((ad) => ad.id !== id));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response && err.response.status === 403) {
          enqueueSnackbar("Your token is invalid or expired", {
            variant: "error",
          });
          return navigate("/authentication/login");
        }
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          enqueueSnackbar(err.response.data.message, {
            variant: "error",
          });
        else
          enqueueSnackbar("Server error!", {
            variant: "error",
          });
      });
  };

  const handleEdit = (id) => {
    navigate(`/ad:${id}`);
  };

  const handleChangeStatus = async (id) => {
    const newStatus = !ads.find((ad) => ad.id === id).isShown;
    setAds((ads) =>
      ads.map((ad) => (ad.id === id ? { ...ad, isShown: newStatus } : ad))
    );
    try {
      await Axios.post(
        "/ads/submit",
        { id, isShown: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      if (err.response && err.response.status === 403) {
        enqueueSnackbar("Your token is invalid or expired", {
          variant: "error",
        });
        return navigate("/authentication/login");
      }
      if (err && err.response && err.response.data && err.response.data.message)
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
        });
      else
        enqueueSnackbar("Unable to update status due to server error!", {
          variant: "error",
        });

      setAds((ads) =>
        ads.map((ad) => (ad.id === id ? { ...ad, isShown: !newStatus } : ad))
      );
    }
  };

  const handleAdd = () => {
    if (isLoading) return;
    navigate(`/ad:`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item xs={12} sm={12} md={12} lg={6} xl={4} key={ad.id}>
            <StyledCard sx={{}}>
              <CardMedia
                component="img"
                height="300"
                image={ad.banner}
                alt="Ad banner"
                sx={{
                  objectFit: "contain",
                  backgroundImage:
                    "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
                  padding: 1,
                }}
              />
              <CardContent
                sx={{
                  height: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "white",
                }}
              >
                <Typography>{ad.link}</Typography>
                <Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Switch
                        checked={ad.isShown}
                        onChange={() => handleChangeStatus(ad.id)}
                        aria-label="Toggle ad visibility"
                      />
                      <Typography>
                        {ad.isShown ? "Enabled" : "Disabled"}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <StyledButton
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        disabled={isLoading}
                        onClick={() => handleEdit(ad.id)}
                        startIcon={<BorderColorIcon />}
                        aria-label="Edit ad details"
                      >
                        Edit
                      </StyledButton>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledButton
                        fullWidth
                        variant="outlined"
                        color="error"
                        disabled={isLoading}
                        onClick={() => handleDelete(ad.id)}
                        startIcon={<DeleteIcon />}
                        aria-label="Delete ad"
                      >
                        Delete
                      </StyledButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}

        <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
          <StyledCard
            sx={{
              height: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
            }}
            onClick={handleAdd}
          >
            <AddIcon sx={{ fontSize: 40 }} />
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
