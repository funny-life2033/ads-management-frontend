import {
  extendTheme,
  // styled
} from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CompanyIcon from "@mui/icons-material/Business";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import DescriptionIcon from "@mui/icons-material/Description";
// import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { Axios } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import Plans from "../subs-plans";
import Dashboard from "../dashboard";
import { useSnackbar } from "notistack";
import Checkout from "../checkout";
import logo from "../../../utils/icon.png";
import Ad from "../ad";
import Cookies from "js-cookie";
import CompanyList from "../companyList";
import Ads from "../ads";

const NAVIGATION = [
  // {
  //   kind: "header",
  //   title: "Main items",
  // },
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

const ADMIN_NAVIGATION = [
  {
    segment: "companyList",
    title: "Company List",
    icon: <CompanyIcon />,
  },
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
      navigation={NAVIGATION.concat(
        Cookies.get("isAdmin") === "true" ? ADMIN_NAVIGATION : []
      )}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={{ signOut: logout, signIn: () => {} }}
      session={{ user: companyData }}
      branding={{ logo: <img src={logo} alt="" />, title: "Vinylbay" }}
    >
      <DashboardLayout>
        <PageContainer>
          {router.pathname === "/dashboard" && (
            <Dashboard navigate={router.navigate} />
          )}
          {router.pathname.startsWith("/ad:") && (
            <Ad
              id={router.pathname.split("/ad:")[1]}
              navigate={router.navigate}
            />
          )}
          {router.pathname === "/plans" && <Plans navigate={router.navigate} />}
          {router.pathname.startsWith("/checkout:") && (
            <Checkout
              productId={router.pathname.split("/checkout:")[1]}
              navigate={router.navigate}
            />
          )}
          {router.pathname === "/companyList" && (
            <CompanyList navigate={router.navigate} />
          )}
          {router.pathname.startsWith("/company:") &&
            router.pathname.endsWith("/ads") && (
              <Ads
                navigate={router.navigate}
                companyId={
                  router.pathname.split("/company:")[1].split("/ads")[0]
                }
              />
            )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Layout;
