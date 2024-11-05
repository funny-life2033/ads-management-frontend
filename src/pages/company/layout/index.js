import {
  extendTheme,
  // styled
} from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import DescriptionIcon from "@mui/icons-material/Description";
// import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { Axios } from "../../../utils";
import { useNavigate } from "react-router-dom";
import Plans from "../subs-plans";
import Dashboard from "../dashboard";
import { useSnackbar } from "notistack";
import Checkout from "../checkout";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "plans",
    title: "Plans",
    icon: <ShoppingCartIcon />,
  },
  // {
  //   kind: "divider",
  // },
  // {
  //   kind: "header",
  //   title: "Analytics",
  // },
  // {
  //   segment: "reports",
  //   title: "Reports",
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: "sales",
  //       title: "Sales",
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: "traffic",
  //       title: "Traffic",
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: "integrations",
  //   title: "Integrations",
  //   icon: <LayersIcon />,
  // },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const useDemoRouter = (initialPath) => {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
};

// const Skeleton = styled("div")(({ theme, height }) => ({
//   backgroundColor: theme.palette.action.hover,
//   borderRadius: theme.shape.borderRadius,
//   height,
//   content: '" "',
// }));

const Layout = ({ window }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    Axios.get("/auth/isAuth", { withCredentials: true })
      .then(({ data }) => {
        setCompanyData({ name: data.company.name, email: data.company.email });
      })
      .catch((_) => {
        navigate("/authentication/login");
      });
  }, [navigate]);

  const logout = async () => {
    try {
      await Axios.get("/auth/logout", { withCredentials: true });
      enqueueSnackbar("You have logged out!", {
        variant: "success",
      });
      navigate("/authentication/login");
    } catch (error) {}
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={{ signOut: logout, signIn: () => {} }}
      session={{ user: companyData }}
    >
      <DashboardLayout>
        <PageContainer>
          {router.pathname === "/dashboard" && <Dashboard />}
          {router.pathname === "/plans" && <Plans navigate={router.navigate} />}
          {router.pathname.startsWith("/checkout:") && (
            <Checkout
              productId={router.pathname.split("/checkout:")[1]}
              navigate={router.navigate}
            />
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Layout;
