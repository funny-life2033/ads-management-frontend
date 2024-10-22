import Stack from "@mui/material/Stack";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Axios } from "../../utils";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";

export default function Authentication() {
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("/auth/isAuth", { withCredentials: true })
      .then((_) => {
        navigate("/company");
      })
      .catch((_) => {});
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      position="fixed"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, padding: 1 }}>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </Stack>
  );
}
