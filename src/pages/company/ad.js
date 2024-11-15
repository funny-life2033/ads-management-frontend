import React, { useEffect, useRef, useState } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
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

const Ad = ({ id, navigate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [adData, setAdData] = useState({
    banner: null,
    link: "",
    isVertical: null,
  });
  const bannerInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isAlreadySetup, setIsAlreadySetup] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Axios.get("/subscription/check", { withCredentials: true });
        setIsPurchased(true);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          enqueueSnackbar("Your token is invalid or expired", {
            variant: "error",
          });
          return navigate("/authentication/login");
        }
      }

      if (id && id !== "") {
        try {
          const res = await Axios.get(`/ads/get/${id}`, {
            withCredentials: true,
          });

          const { banner, link, isVertical } = res.data;
          setIsAlreadySetup(true);
          setAdData({
            banner,
            link: link || "",
            isVertical: isVertical,
          });
        } catch (error) {
          if (error.response && error.response.status === 403) {
            enqueueSnackbar("Your token is invalid or expired", {
              variant: "error",
            });
            return navigate("/authentication/login");
          }
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
            });
            navigate("/dashboard");
          } else
            enqueueSnackbar("Server error!", {
              variant: "error",
            });
        }
      }
      setIsLoading(false);
    };

    init();
  }, [id, enqueueSnackbar, navigate]);

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
    const link = adData.link;
    const isVertical = adData.isVertical;

    return `<!doctype html>
<html class="js" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" href="/utils/product_page_files/slick-theme.min.css" />
    <link rel="stylesheet" href="/utils/product_page_files/slick.min.css" />

    <script>
      function redirectToParent(url) {
        window.parent.open(url,'_blank');
      }
    </script>

    <style data-shopify="">
      @font-face {
        font-family: Poppins;
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n4.934accbf9f5987aa89334210e6c1e9151f37d3b6.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=9d357b81830c1189289bd00acbccf71c24a87b5799f006a39f7e66019355ebfd")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n4.ee28d4489eaf5de9cf6e17e696991b5e9148c716.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=d8e89da1f8c729f4ba3dc0a6ebe23ff62121eb79d235020582c99cd07d83a26b")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n7.58aca33913fc6666cc9e8a53f6b16ec5c3c05a3f.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=49beed38c4d139ca94599f4765ca5c37de7a0ec47d2e4abecb6f23185783efbf")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n7.59016f931f3f39434d2e458fba083eb7db7a07d9.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=9dd85259cabfdc1fb78edde6d5d10c7417fc2ef0ec6d36292d3ef45acb09085f")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 400;
        font-style: italic;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i4.a7e8d886e15d5fb9bc964a53b3278effbf270e9c.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=d78fd90d4223c53e05f866c633bc0f5554c960614000155523e06273c951351e")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i4.e87de252199e27825a41bf81646996685d86452d.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=a0eaeea31efaecd24b1aecf49b22aad42e7952f55813bb76ca351aefac7b8763")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 700;
        font-style: italic;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i7.4f85a5d51a1aecf426eea47ac4570ef7341bfdc1.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=fb6a88b862d84ff770299fc9aca365cdd3a359831d00c699dd682f57ff026daf")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i7.aff3a08a92d1c136586c611b9fc43d357dfbbefe.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=4ac2ad38cfb3002b0245ae67e30abaf60017883b81d331254b58ec42c8ab6358")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n4.934accbf9f5987aa89334210e6c1e9151f37d3b6.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=9d357b81830c1189289bd00acbccf71c24a87b5799f006a39f7e66019355ebfd")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n4.ee28d4489eaf5de9cf6e17e696991b5e9148c716.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=d8e89da1f8c729f4ba3dc0a6ebe23ff62121eb79d235020582c99cd07d83a26b")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n7.58aca33913fc6666cc9e8a53f6b16ec5c3c05a3f.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=49beed38c4d139ca94599f4765ca5c37de7a0ec47d2e4abecb6f23185783efbf")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n7.59016f931f3f39434d2e458fba083eb7db7a07d9.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=9dd85259cabfdc1fb78edde6d5d10c7417fc2ef0ec6d36292d3ef45acb09085f")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 400;
        font-style: italic;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i4.a7e8d886e15d5fb9bc964a53b3278effbf270e9c.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=d78fd90d4223c53e05f866c633bc0f5554c960614000155523e06273c951351e")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i4.e87de252199e27825a41bf81646996685d86452d.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=a0eaeea31efaecd24b1aecf49b22aad42e7952f55813bb76ca351aefac7b8763")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 700;
        font-style: italic;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i7.4f85a5d51a1aecf426eea47ac4570ef7341bfdc1.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=fb6a88b862d84ff770299fc9aca365cdd3a359831d00c699dd682f57ff026daf")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_i7.aff3a08a92d1c136586c611b9fc43d357dfbbefe.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=4ac2ad38cfb3002b0245ae67e30abaf60017883b81d331254b58ec42c8ab6358")
            format("woff");
      }

      @font-face {
        font-family: Poppins;
        font-weight: 600;
        font-style: normal;
        font-display: swap;
        src:
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n6.e2fdd168541a5add2d1a8d6f2b89b09c9c9e690d.woff2?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=5d23fce1e2af01dde405e11160deb9ba8e50bccc0ad52cc87dc22f9b81636323")
            format("woff2"),
          url("//vinylbay777.com/cdn/fonts/poppins/poppins_n6.6d62d2d0f11a9ff578d200ad2154f9860db165c1.woff?h1=NzM5NTI1LTNjLmFjY291bnQubXlzaG9waWZ5LmNvbQ&h2=dmlueWxiYXk3NzcuY29t&hmac=14c1ba172a0e35567829e3aa604a2cf30767abe80ee6ce09e9fcb2a496e45783")
            format("woff");
      }

      :root {
        --page-width: 158rem;
        --spacing-base-1: 2rem;

        --grid-desktop-horizontal-spacing: 16px;
        --grid-desktop-vertical-spacing: 16px;
        --grid-mobile-horizontal-spacing: 10px;
        --grid-mobile-vertical-spacing: 10px;

        --border-radius-base: 5px;
        --buttons-radius: 5px;
        --inputs-radius: 5px;
        --inputs-border-width: 1px;
        --inputs-border-opacity: 0.2;

        --color-base-white: #fff;
        --color-product-review-star: #ffb800;
        --color-base-text: 64, 64, 64;
        --color-base-text-alt: 27, 27, 27;
        --color-base-border: 225, 225, 225;
        --color-base-background-1: 246, 246, 246;
        --color-base-background-2: 255, 255, 255;
        --color-base-accent-1: 64, 47, 46;
        --color-base-accent-1-text: 255, 255, 255;
        --color-base-accent-2: 247, 149, 24;
        --color-base-accent-2-text: 33, 33, 33;
        --color-base-accent-3: 0, 0, 0;
        --color-base-accent-3-text: 255, 255, 255;
        --color-button-disabled: #e1e1e1;
        --color-card-border: 246, 246, 246;

        --color-buttons-primary-background: 247, 149, 24;

        --color-buttons-primary-text: 41, 29, 28;

        --color-buttons-secondary-background: 94, 63, 61;

        --color-buttons-secondary-text: 255, 255, 255;

        --color-sale: rgba(206, 51, 60, 1);
        --color-sale-background: #f1c3c6;
        --color-error: rgba(188, 34, 34, 1);
        --color-error-background: #fcecec;
        --color-success: rgba(26, 127, 36, 1);
        --color-success-background: #eefcef;
        --color-warning: rgba(189, 107, 27, 1);
        --color-warning-background: #f8e1cb;
        --color-preorder: rgba(11, 108, 255, 1);
        --color-preorder-background: #d2e4ff;
        --color-backorder: rgba(26, 127, 36, 1);
        --color-backorder-background: #b3efb9;
        --color-price: 27, 27, 27, 1;
        --color-price-discounted: 64, 64, 64, 1;

        --font-body-family: Poppins, sans-serif;
        --font-body-style: normal;
        --font-body-weight: 400;
        --font-bolder-weight: 600;

        --font-heading-family: Poppins, sans-serif;
        --font-heading-style: normal;
        --font-heading-weight: 400;

        --font-body-scale: 1;
        --font-heading-scale: 1;
        --font-product-price-scale: 1;
        --font-product-price-grid-scale: 1;

        --font-buttons-family: Poppins, sans-serif;
      }
    </style>

    <link
      href="/utils/product_page_files/base.css"
      rel="stylesheet"
      type="text/css"
      media="all"
    />
    <link
      href="/utils/product_page_files/style.css"
      rel="stylesheet"
      type="text/css"
      media="all"
    />

    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/app.BkkclL8b.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/OnePage.BsDM6oHQ.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/DeliveryMethodSelectorSection.DNerkzQV.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/Rollup.o9Mx-fKL.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/SubscriptionPriceBreakdown.Bqs0s4oM.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/ShopPayLogo.D_HPU8Dh.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/PickupPointCarrierLogo.C0wRU6wV.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/VaultedPayment.BO3829nT.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/Section.BzDw6wmZ.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/ShopPayLoginLoader.CjGSo8kt.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/PayButtonSection.DF7trkKf.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/RageClickCapture.DnkQ4tsk.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/DutyOptions.Bd1Z60K2.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/useAmazonContact.D-Ox6Dnf.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/StockProblemsLineItemList.CxdIQKjw.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="style"
      href="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/ShopPayVerificationSwitch.DVQdwG9J.css"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="font"
      type="font/woff2"
      href="https://fonts.shopifycdn.com/poppins/poppins_n4.934accbf9f5987aa89334210e6c1e9151f37d3b6.woff2?h1=dmlueWxiYXk3NzcuY29t&amp;hmac=f35548cddbac2b2301e6a5495ca90a6d8a195f960d136100d5e87340cd11520c"
      crossorigin=""
    />
    <link
      rel="prefetch"
      fetchpriority="low"
      as="font"
      type="font/woff2"
      href="https://fonts.shopifycdn.com/poppins/poppins_n7.58aca33913fc6666cc9e8a53f6b16ec5c3c05a3f.woff2?h1=dmlueWxiYXk3NzcuY29t&amp;hmac=5bfabbd4d987d8c2833b07a28f97f839204bcd9ffe35c6c7968015cd80444609"
      crossorigin=""
    />
  </head>

  <body
    class="template-product setting-buttons-solid"
    data-new-gr-c-s-check-loaded="14.1207.0"
  >
    <div
      id="shopify-section-sections--22972339290394__announcement-bar"
      class="shopify-section shopify-section-group-header-group"
    >
      <style>
        @media (min-width: 990px) {
          .announcement-bar {
            padding-top: 1.3rem;
            padding-bottom: 1.3rem;
          }
        }
      </style>
      <div class="announcement-bar-wrapper color-accent-2">
        <div class="container">
          <div class="announcement-bar">
            <div class="announcement-bar-left">
              <a>Questions? Call Us! 516-595-7210 </a>
            </div>

            <div class="announcement-bar-right">
              <ul
                class="navigation-menu navigation-announcement-bar navigation-menu-end"
                role="list"
              >
                <li class="navigation-item navigation-item-end">
                  <a>
                    Get Directions
                  </a>
                </li>
                <li class="navigation-item">
                  <a>
                    About us
                  </a>
                </li>
                <li class="navigation-item">
                  <a>
                    Sell My Collection
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="shopify-section-sections--22972339290394__header"
      class="shopify-section shopify-section-group-header-group section-header section-header-sticky animate"
    >
      <link
        rel="stylesheet"
        href="/utils/product_page_files/component-predictive-search.css"
        media="all"
      />
      <link
        rel="stylesheet"
        href="/utils/product_page_files/component-price.css"
        media="all"
      />

      <style>
        .header-heading img {
          width: 160px;
        }

        @media (min-width: 750px) {
          .header-heading img {
            max-width: 160px;
          }
        }

        @media (min-width: 990px) {
          .head-row-main {
            padding-top: 0;
            padding-bottom: 0;
          }

          .navigation-main > .navigation-item {
            padding-top: 2.5rem;
            padding-bottom: 2.5rem;
          }
        }
      </style>

      <svg class="visually-hidden">
        <lineargradient id="rating-star-gradient-half">
          <stop
            offset="50%"
            stop-color="var(--color-product-review-star)"
          ></stop>
          <stop
            offset="50%"
            stop-color="rgba(var(--color-foreground), .5)"
            stop-opacity="0.5"
          ></stop>
        </lineargradient>
      </svg>

      <sticky-header>
        <header id="header" class="header header-menu-position-center">
          <div class="head-mast color-background-2">
            <div class="container">
              <div class="head-row head-row-main">
                <div
                  class="head-row-slot head-row-slot-start head-row-slot-site-branding"
                >
                  <span class="header-heading h2">
                    <a><img
                        src="/utils/product_page_files/Vinyl_Bay_777_logo_1.png"
                        srcset="
                          //vinylbay777.com/cdn/shop/files/Vinyl_Bay_777_logo_1.png?v=1719582499&amp;width=160 1x,
                          //vinylbay777.com/cdn/shop/files/Vinyl_Bay_777_logo_1.png?v=1719582499&amp;width=320 2x
                        "
                        alt="Vinyl Bay 777"
                        width="1694"
                        height="821"
                    /></a>
                  </span>
                </div>
                <div
                  class="head-row-slot head-row-slot-mid head-row-slot-main-nav"
                >
                  <nav class="nav-main typography-body">
                    <ul class="navigation-menu navigation-main" role="list">
                      <li class="navigation-item has-sub-menu">
                        <a    reinhold-gliere-all-union-radio-orchestra-miroshnichenko-bolshoi-theatre-orchestra-ermler-gliere-conducts-gliere-symphony-no-2-1995-81-3002-new-sealed-cds#"
                        >
                          Shop By Genre

                          <svg
                            focusable="false"
                            class="icon icon-angle"
                            viewBox="0 0 12 8"
                            role="presentation"
                          >
                            <path
                              stroke="currentColor"
                              stroke-width="2"
                              d="M10 2L6 6 2 2"
                              fill="none"
                              stroke-linecap="square"
                            ></path>
                          </svg>
                        </a>
                      </li>

                      <li class="navigation-item has-sub-menu">
                        <a>
                          Shop

                          <svg
                            focusable="false"
                            class="icon icon-angle"
                            viewBox="0 0 12 8"
                            role="presentation"
                          >
                            <path
                              stroke="currentColor"
                              stroke-width="2"
                              d="M10 2L6 6 2 2"
                              fill="none"
                              stroke-linecap="square"
                            ></path>
                          </svg>
                        </a>
                      </li>

                      <li class="navigation-item">
                        <a>
                          New Arrivals
                        </a>
                      </li>

                      <li class="navigation-item">
                        <a>
                          On Sale
                        </a>
                      </li>

                      <li class="navigation-item">
                        <a>
                          The Vault
                        </a>
                      </li>

                      <li class="navigation-item">
                        <a>
                          Contact
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div
                  class="head-row-slot head-row-slot-end head-row-slot-items"
                >
                  <div class="head-slot-item head-slot-item-global-search">
                    <header-search-dropdown-modal
                      class="header-search-modal dropdown-modal"
                      data-event-prefix="header-search"
                    >
                      <button
                        type="button"
                        class="head-slot-global-search-link dropdown-modal-toggle"
                        aria-haspopup="dialog"
                        aria-label="Search"
                        aria-expanded="false"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.3292 13.7543L10.8473 10.2723C11.7961 9.11185 12.2627 7.63105 12.1504 6.13624C12.038 4.64143 11.3555 3.24698 10.2439 2.2413C9.13226 1.23563 7.67663 0.695687 6.17807 0.733155C4.67952 0.770624 3.25269 1.38264 2.19272 2.44261C1.13276 3.50258 0.520741 4.9294 0.483273 6.42796C0.445804 7.92651 0.985748 9.38214 1.99142 10.4938C2.99709 11.6054 4.39155 12.2879 5.88636 12.4002C7.38117 12.5126 8.86197 12.046 10.0225 11.0972L13.5044 14.5791C13.6144 14.6853 13.7617 14.7441 13.9147 14.7428C14.0676 14.7415 14.2139 14.6801 14.3221 14.572C14.4303 14.4638 14.4916 14.3175 14.4929 14.1646C14.4943 14.0116 14.4355 13.8643 14.3292 13.7543ZM6.33345 11.25C5.41047 11.25 4.50822 10.9763 3.74079 10.4635C2.97336 9.95075 2.37522 9.22191 2.02201 8.36919C1.6688 7.51647 1.57639 6.57816 1.75645 5.67291C1.93652 4.76767 2.38097 3.93615 3.03362 3.2835C3.68626 2.63086 4.51778 2.1864 5.42303 2.00633C6.32827 1.82627 7.26658 1.91869 8.11931 2.2719C8.97203 2.6251 9.70086 3.22324 10.2136 3.99067C10.7264 4.7581 11.0001 5.66035 11.0001 6.58333C10.9987 7.82058 10.5066 9.00676 9.63175 9.88163C8.75688 10.7565 7.5707 11.2486 6.33345 11.25Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>

                      <div
                        class="header-search-global color-background-2"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search"
                      >
                        <predictive-search
                          class="header-search-global-component"
                          data-loading-text="Loading..."
                          data-limit="4"
                          data-limit-scope="each"
                          data-unavailable="last"
                          data-types="product,query,collection,article,page"
                          ><form
                            action="https://vinylbay777.com/search"
                            method="get"
                            role="search"
                            class="search header-search-global-form"
                          >
                            <div class="header-search-global-form-wrap">
                              <input
                                type="search"
                                id="header-global-search-input"
                                name="q"
                                value=""
                                placeholder="Search for products"
                                class="header-global-search-input"
                                role="combobox"
                                aria-expanded="false"
                                aria-owns="predictive-search-results-list"
                                aria-controls="predictive-search-results-list"
                                aria-haspopup="listbox"
                                aria-autocomplete="list"
                                autocorrect="off"
                                autocomplete="off"
                                autocapitalize="off"
                                spellcheck="false"
                              />
                              <label
                                for="header-global-search-input"
                                class="visually-hidden"
                                >Search for products</label
                              >

                              <input
                                type="hidden"
                                name="options[prefix]"
                                value="last"
                              />
                              <input
                                type="hidden"
                                name="type"
                                value="product,article,page"
                              />
                              <input
                                type="hidden"
                                name="options[unavailable_products]"
                                value="last"
                              />

                              <button type="submit" class="button icon-left">
                                Search
                              </button>
                            </div>
                            <div
                              class="predictive-search predictive-search-header"
                              tabindex="-1"
                              data-predictive-search=""
                            >
                              <div class="predictive-search-loading-state">
                                <span class="spinner-sm"></span>
                              </div>
                            </div>

                            <span
                              class="predictive-search-status visually-hidden"
                              role="status"
                              aria-hidden="true"
                            ></span></form
                        ></predictive-search>
                      </div>
                    </header-search-dropdown-modal>
                  </div>
                  <a
                    class="head-slot-item"
                  >
                    <span class="visually-hidden">Log in </span>

                    <svg
                      width="11"
                      height="15"
                      viewBox="0 0 11 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 7.75C6.19223 7.75 6.86892 7.54473 7.4445 7.16014C8.02007 6.77556 8.46867 6.22893 8.73358 5.58939C8.99848 4.94985 9.0678 4.24612 8.93275 3.56719C8.7977 2.88825 8.46436 2.26461 7.97487 1.77513C7.48539 1.28564 6.86175 0.952301 6.18282 0.817253C5.50388 0.682205 4.80015 0.751517 4.16061 1.01642C3.52107 1.28133 2.97444 1.72993 2.58986 2.30551C2.20527 2.88108 2 3.55777 2 4.25C2.00093 5.17797 2.36997 6.06768 3.02615 6.72385C3.68233 7.38003 4.57203 7.74907 5.5 7.75ZM5.5 1.91667C5.96149 1.91667 6.41261 2.05352 6.79633 2.30991C7.18004 2.5663 7.47911 2.93071 7.65572 3.35707C7.83232 3.78343 7.87853 4.25259 7.7885 4.70521C7.69847 5.15783 7.47624 5.5736 7.14992 5.89992C6.82359 6.22624 6.40783 6.44847 5.95521 6.5385C5.50259 6.62853 5.03343 6.58232 4.60707 6.40572C4.18071 6.22912 3.81629 5.93005 3.5599 5.54633C3.30351 5.16262 3.16667 4.71149 3.16667 4.25C3.16667 3.63116 3.4125 3.03767 3.85008 2.60009C4.28767 2.1625 4.88116 1.91667 5.5 1.91667ZM5.5 8.91667C4.10809 8.91821 2.77363 9.47183 1.78939 10.4561C0.805163 11.4403 0.251544 12.7748 0.25 14.1667C0.25 14.3214 0.311458 14.4698 0.420854 14.5791C0.530251 14.6885 0.678624 14.75 0.833333 14.75C0.988043 14.75 1.13642 14.6885 1.24581 14.5791C1.35521 14.4698 1.41667 14.3214 1.41667 14.1667C1.41667 13.0837 1.84687 12.0451 2.61265 11.2793C3.37842 10.5135 4.41703 10.0833 5.5 10.0833C6.58297 10.0833 7.62158 10.5135 8.38735 11.2793C9.15312 12.0451 9.58333 13.0837 9.58333 14.1667C9.58333 14.3214 9.64479 14.4698 9.75419 14.5791C9.86358 14.6885 10.012 14.75 10.1667 14.75C10.3214 14.75 10.4697 14.6885 10.5791 14.5791C10.6885 14.4698 10.75 14.3214 10.75 14.1667C10.7485 12.7748 10.1948 11.4403 9.2106 10.4561C8.22637 9.47183 6.89191 8.91821 5.5 8.91667Z"
                        fill="white"
                      ></path>
                    </svg>
                  </a>
                  <div class="head-slot-item">
                    <link
                      href="/utils/product_page_files/component-drawer.css"
                      rel="stylesheet"
                      type="text/css"
                      media="all"
                    />
                    <link
                      href="/utils/product_page_files/component-discounts.css"
                      rel="stylesheet"
                      type="text/css"
                      media="all"
                    />
                    <link
                      rel="stylesheet"
                      href="/utils/product_page_files/component-cart-items.css"
                      media="all"
                    />
                    <link
                      rel="stylesheet"
                      href="/utils/product_page_files/component-header-mini-cart.css"
                      media="all"
                    />

                    <noscript
                      ><link
                        href="//vinylbay777.com/cdn/shop/t/2/assets/component-cart-items.css?v=27663777921113179291718583758"
                        rel="stylesheet"
                        type="text/css"
                        media="all"
                    /></noscript>
                    <noscript
                      ><link
                        href="//vinylbay777.com/cdn/shop/t/2/assets/component-header-mini-cart.css?v=146334571760893356231718583757"
                        rel="stylesheet"
                        type="text/css"
                        media="all"
                    /></noscript>

                    <mini-cart data-event-context="MiniCart">
                      <header-mini-cart-dropdown-modal
                        id="HeaderMiniCart"
                        class="dropdown-modal"
                        body-class="header-mini-cart-open"
                        role="dialog"
                        aria-modal="true"
                        data-event-prefix="header-cart"
                      >
                        <a
                          class="head-slot-cart-link dropdown-modal-toggle"
                          aria-expanded="false"
                        >
                          <span class="visually-hidden">Open mini cart</span>

                          <svg
                            width="15"
                            height="16"
                            viewBox="0 0 15 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3.0625C10 2.8875 10.1375 2.75 10.3125 2.75H14.0625C14.2375 2.75 14.375 2.8875 14.375 3.0625C14.375 3.2375 14.2375 3.375 14.0625 3.375H10.3125C10.1375 3.375 10 3.2375 10 3.0625ZM14.725 4.25C14.5625 4.21875 14.3937 4.325 14.3562 4.49375L13.8062 7.2375C13.6 8.25625 12.7 8.99375 11.6625 8.99375H3.675L2.89375 3.36875H8.4375C8.6125 3.36875 8.75 3.23125 8.75 3.05625C8.75 2.88125 8.6125 2.74375 8.4375 2.74375H2.80625L2.64375 1.59375C2.5375 0.83125 1.875 0.25 1.1 0.25H0.3125C0.1375 0.25 0 0.3875 0 0.5625C0 0.7375 0.1375 0.875 0.3125 0.875H1.1C1.56875 0.875 1.9625 1.225 2.03125 1.68125L3.14375 9.7C3.3375 11.0813 4.53125 12.125 5.93125 12.125H12.1938C12.3688 12.125 12.5063 11.9875 12.5063 11.8125C12.5063 11.6375 12.3688 11.5 12.1938 11.5H5.925C4.84375 11.5 3.9125 10.6938 3.7625 9.625H11.6625C13 9.625 14.1562 8.675 14.4187 7.3625L14.9688 4.61875C15 4.45 14.8937 4.2875 14.725 4.25ZM5.625 14C5.625 14.6875 5.0625 15.25 4.375 15.25C3.6875 15.25 3.125 14.6875 3.125 14C3.125 13.3125 3.6875 12.75 4.375 12.75C5.0625 12.75 5.625 13.3125 5.625 14ZM5 14C5 13.6562 4.71875 13.375 4.375 13.375C4.03125 13.375 3.75 13.6562 3.75 14C3.75 14.3438 4.03125 14.625 4.375 14.625C4.71875 14.625 5 14.3438 5 14ZM11.875 14C11.875 14.6875 11.3125 15.25 10.625 15.25C9.9375 15.25 9.375 14.6875 9.375 14C9.375 13.3125 9.9375 12.75 10.625 12.75C11.3125 12.75 11.875 13.3125 11.875 14ZM11.25 14C11.25 13.6562 10.9688 13.375 10.625 13.375C10.2812 13.375 10 13.6562 10 14C10 14.3438 10.2812 14.625 10.625 14.625C10.9688 14.625 11.25 14.3438 11.25 14Z"
                              fill="white"
                            ></path>
                          </svg>
                        </a>

                        <div class="mini-cart-wrap color-background-2">
                          <form
                            action="https://vinylbay777.com/cart"
                            method="post"
                            class="mini-cart-inner"
                          >
                            <div class="mini-cart-header" tabindex="-1">
                              <h4 class="h5">Your cart</h4>
                              <button
                                type="button"
                                class="button button-tertiary button-drawer-header-dismiss dropdown-modal-toggle"
                                aria-label="Close"
                                aria-expanded="false"
                              >
                                ×
                              </button>
                            </div>

                            <div
                              id="header-mini-cart-content"
                              class="mini-cart-content-inner"
                            >
                              <div
                                id="mini-cart-error"
                                class="mini-cart-error form-status form-status-error"
                              ></div>

                              <div class="mini-cart-message-empty">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.5 3L5.24246 2.89393C5.18968 2.52445 4.87324 2.25 4.5 2.25V3ZM2 2.25C1.58579 2.25 1.25 2.58579 1.25 3C1.25 3.41421 1.58579 3.75 2 3.75V2.25ZM6.5 17L5.75754 17.1061C5.81032 17.4756 6.12676 17.75 6.5 17.75V17ZM21 5L21.7115 5.23717C21.7877 5.00846 21.7494 4.75704 21.6084 4.56147C21.4675 4.36589 21.2411 4.25 21 4.25V5ZM18 14V14.75C18.3228 14.75 18.6094 14.5434 18.7115 14.2372L18 14ZM6.07142 13.25C5.65721 13.25 5.32142 13.5858 5.32142 14C5.32142 14.4142 5.65721 14.75 6.07142 14.75V13.25ZM4.78571 4.25C4.37149 4.25 4.03571 4.58579 4.03571 5C4.03571 5.41421 4.37149 5.75 4.78571 5.75V4.25ZM4.5 2.25H2V3.75H4.5V2.25ZM6.5 17.75H17V16.25H6.5V17.75ZM7.24246 16.8939L5.24246 2.89393L3.75754 3.10607L5.75754 17.1061L7.24246 16.8939ZM20.2885 4.76283L17.2885 13.7628L18.7115 14.2372L21.7115 5.23717L20.2885 4.76283ZM18 13.25H6.07142V14.75H18V13.25ZM4.78571 5.75H21V4.25H4.78571V5.75ZM10.25 19C10.25 19.6904 9.69036 20.25 9 20.25V21.75C10.5188 21.75 11.75 20.5188 11.75 19H10.25ZM9 20.25C8.30964 20.25 7.75 19.6904 7.75 19H6.25C6.25 20.5188 7.48122 21.75 9 21.75V20.25ZM7.75 19C7.75 18.3096 8.30964 17.75 9 17.75V16.25C7.48122 16.25 6.25 17.4812 6.25 19H7.75ZM9 17.75C9.69036 17.75 10.25 18.3096 10.25 19H11.75C11.75 17.4812 10.5188 16.25 9 16.25V17.75ZM18.25 19C18.25 19.6904 17.6904 20.25 17 20.25V21.75C18.5188 21.75 19.75 20.5188 19.75 19H18.25ZM17 20.25C16.3096 20.25 15.75 19.6904 15.75 19H14.25C14.25 20.5188 15.4812 21.75 17 21.75V20.25ZM15.75 19C15.75 18.3096 16.3096 17.75 17 17.75V16.25C15.4812 16.25 14.25 17.4812 14.25 19H15.75ZM17 17.75C17.6904 17.75 18.25 18.3096 18.25 19H19.75C19.75 17.4812 18.5188 16.25 17 16.25V17.75Z"
                                    fill="#001A72"
                                  ></path>
                                </svg>

                                <p>Your cart is empty</p>
                              </div>
                            </div>

                            <div
                              id="header-mini-cart-footer"
                              class="header-mini-cart-footer"
                            ></div>
                          </form>
                        </div>
                      </header-mini-cart-dropdown-modal>
                    </mini-cart>
                  </div>

                  <div class="head-slot-nav-mobile-link-wrapper">
                    <button
                      class="head-slot-nav-link head-slot-nav-mobile-link button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-controls="mobile-menu"
                      aria-label="Open menu"
                    >
                      <span class="icon-state-primary">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 16.25C3.58579 16.25 3.25 16.5858 3.25 17C3.25 17.4142 3.58579 17.75 4 17.75V16.25ZM20 17.75C20.4142 17.75 20.75 17.4142 20.75 17C20.75 16.5858 20.4142 16.25 20 16.25V17.75ZM4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75V11.25ZM20 12.75C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25V12.75ZM4 6.25C3.58579 6.25 3.25 6.58579 3.25 7C3.25 7.41421 3.58579 7.75 4 7.75V6.25ZM20 7.75C20.4142 7.75 20.75 7.41421 20.75 7C20.75 6.58579 20.4142 6.25 20 6.25V7.75ZM4 17.75H20V16.25H4V17.75ZM4 12.75H20V11.25H4V12.75ZM4 7.75H20V6.25H4V7.75Z"
                            fill="#001A72"
                          ></path>
                        </svg>
                      </span>
                      <span class="icon-state-secondary">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.5303 5.53033C19.8232 5.23744 19.8232 4.76256 19.5303 4.46967C19.2374 4.17678 18.7626 4.17678 18.4697 4.46967L19.5303 5.53033ZM4.46967 18.4697C4.17678 18.7626 4.17678 19.2374 4.46967 19.5303C4.76256 19.8232 5.23744 19.8232 5.53033 19.5303L4.46967 18.4697ZM5.53034 4.46967C5.23745 4.17678 4.76258 4.17678 4.46968 4.46967C4.17679 4.76256 4.17679 5.23744 4.46968 5.53033L5.53034 4.46967ZM18.4697 19.5303C18.7626 19.8232 19.2375 19.8232 19.5304 19.5303C19.8232 19.2374 19.8232 18.7626 19.5304 18.4697L18.4697 19.5303ZM18.4697 4.46967L4.46967 18.4697L5.53033 19.5303L19.5303 5.53033L18.4697 4.46967ZM4.46968 5.53033L18.4697 19.5303L19.5304 18.4697L5.53034 4.46967L4.46968 5.53033Z"
                            fill="#001A72"
                          ></path>
                        </svg>
                      </span>
                    </button>

                    <div
                      class="mobile-menu color-background-2"
                      aria-hidden="true"
                    >
                      <div class="mobile-menu-inner">
                        <nav
                          class="navigation-mobile-wrap typography-body"
                          tabindex="-1"
                        >
                          <ul class="navigation-mobile">
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a
                                  reinhold-gliere-all-union-radio-orchestra-miroshnichenko-bolshoi-theatre-orchestra-ermler-gliere-conducts-gliere-symphony-no-2-1995-81-3002-new-sealed-cds#"
                                >
                                  Shop By Genre </a
                                ><button
                                  class="navigation-mobile-item-link-expand"
                                >
                                  <svg
                                    focusable="false"
                                    class="icon icon-angle"
                                    viewBox="0 0 12 8"
                                    role="presentation"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-width="2"
                                      d="M10 2L6 6 2 2"
                                      fill="none"
                                      stroke-linecap="square"
                                    ></path>
                                  </svg></button
                              ></span>
                              <ul class="navigation-sub-menu">
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Rock &amp; Pop
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Heavy Metal
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Hip Hop
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Blues
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Country
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Jazz
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      R &amp; B
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Punk
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Electronic
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Folk
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Reggae
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Latin
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      International
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Soundtracks
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Non-Music
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Children’s
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Classical
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Holiday
                                    </a></span
                                  >
                                </li>
                              </ul>
                            </li>
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a>
                                  Shop </a
                                ><button
                                  class="navigation-mobile-item-link-expand"
                                >
                                  <svg
                                    focusable="false"
                                    class="icon icon-angle"
                                    viewBox="0 0 12 8"
                                    role="presentation"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-width="2"
                                      d="M10 2L6 6 2 2"
                                      fill="none"
                                      stroke-linecap="square"
                                    ></path>
                                  </svg></button
                              ></span>
                              <ul class="navigation-sub-menu">
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Vinyl </a
                                    ><button
                                      class="navigation-mobile-item-link-expand"
                                    >
                                      <svg
                                        focusable="false"
                                        class="icon icon-angle"
                                        viewBox="0 0 12 8"
                                        role="presentation"
                                      >
                                        <path
                                          stroke="currentColor"
                                          stroke-width="2"
                                          d="M10 2L6 6 2 2"
                                          fill="none"
                                          stroke-linecap="square"
                                        ></path>
                                      </svg></button
                                  ></span>
                                  <ul class="navigation-sub-menu">
                                    <li class="navigation-mobile-item">
                                      <span class="navigation-mobile-item-link">
                                        <a>
                                          12” Vinyl
                                        </a>
                                      </span>
                                    </li>
                                    <li class="navigation-mobile-item">
                                      <span class="navigation-mobile-item-link">
                                        <a>
                                          10” Vinyl
                                        </a>
                                      </span>
                                    </li>
                                    <li class="navigation-mobile-item">
                                      <span class="navigation-mobile-item-link">
                                        <a>
                                          7” Vinyl
                                        </a>
                                      </span>
                                    </li>
                                  </ul>
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      CDs
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Cassettes
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      DVDs &amp; Blu-Rays
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Apparel </a
                                    ><button
                                      class="navigation-mobile-item-link-expand"
                                    >
                                      <svg
                                        focusable="false"
                                        class="icon icon-angle"
                                        viewBox="0 0 12 8"
                                        role="presentation"
                                      >
                                        <path
                                          stroke="currentColor"
                                          stroke-width="2"
                                          d="M10 2L6 6 2 2"
                                          fill="none"
                                          stroke-linecap="square"
                                        ></path>
                                      </svg></button
                                  ></span>
                                  <ul class="navigation-sub-menu">
                                    <li class="navigation-mobile-item">
                                      <span class="navigation-mobile-item-link">
                                        <a>
                                          Store Merch
                                        </a>
                                      </span>
                                    </li>
                                    <li class="navigation-mobile-item">
                                      <span class="navigation-mobile-item-link">
                                        <a>
                                          All Apparel
                                        </a>
                                      </span>
                                    </li>
                                  </ul>
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Books
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Art
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Memorabilia
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Vintage
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Collectibles
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Gift Cards
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Blank Media
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      LaserDiscs
                                    </a></span
                                  >
                                </li>
                                <li class="navigation-mobile-item">
                                  <span class="navigation-mobile-item-link">
                                    <a>
                                      Wholesale Lots
                                    </a></span
                                  >
                                </li>
                              </ul>
                            </li>
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a>
                                  New Arrivals
                                </a></span
                              >
                            </li>
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a>
                                  On Sale
                                </a></span
                              >
                            </li>
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a>
                                  The Vault
                                </a></span
                              >
                            </li>
                            <li class="navigation-mobile-item">
                              <span class="navigation-mobile-item-link">
                                <a>
                                  Contact
                                </a></span
                              >
                            </li>
                          </ul>
                        </nav>

                        <div class="mobile-menu-utilities">
                          <div class="mobile-menu-utility-section">
                            <div class="mobile-menu-region-currency">
                              <link
                                href="/utils/product_page_files/component-dropdown.css"
                                rel="stylesheet"
                                type="text/css"
                                media="all"
                              />

                              

                              <noscript
                                ><form
                                  method="post"
                                  action="/localization"
                                  id="HeaderCountryFormNoScript"
                                  accept-charset="UTF-8"
                                  class="localization-form"
                                  enctype="multipart/form-data"
                                >
                                  <input
                                    type="hidden"
                                    name="form_type"
                                    value="localization"
                                  /><input
                                    type="hidden"
                                    name="utf8"
                                    value="✓"
                                  /><input
                                    type="hidden"
                                    name="_method"
                                    value="put"
                                  /><input
                                    type="hidden"
                                    name="return_to"
                                    value="/products/reinhold-gliere-all-union-radio-orchestra-miroshnichenko-bolshoi-theatre-orchestra-ermler-gliere-conducts-gliere-symphony-no-2-1995-81-3002-new-sealed-cds"
                                  />
                                  <div class="localization-form-select">
                                    <h2
                                      class="visually-hidden"
                                      id="HeaderCountryLabelNoScriptMobileMenu"
                                    >
                                      Country/region
                                    </h2>
                                    <select
                                      class="localization-selector link"
                                      name="country_code"
                                      aria-labelledby="HeaderCountryLabelNoScriptMobileMenu"
                                    >
                                      <option value="AU">
                                        Australia (USD $)
                                      </option>
                                      <option value="AT">
                                        Austria (USD $)
                                      </option>
                                      <option value="BE">
                                        Belgium (USD $)
                                      </option>
                                      <option value="CA">Canada (USD $)</option>
                                      <option value="CZ">
                                        Czechia (USD $)
                                      </option>
                                      <option value="DK">
                                        Denmark (USD $)
                                      </option>
                                      <option value="FI">
                                        Finland (USD $)
                                      </option>
                                      <option value="FR">France (USD $)</option>
                                      <option value="DE">
                                        Germany (USD $)
                                      </option>
                                      <option value="HK">
                                        Hong Kong SAR (USD $)
                                      </option>
                                      <option value="IE">
                                        Ireland (USD $)
                                      </option>
                                      <option value="IL">Israel (USD $)</option>
                                      <option value="IT">Italy (USD $)</option>
                                      <option value="JP">Japan (USD $)</option>
                                      <option value="MY">
                                        Malaysia (USD $)
                                      </option>
                                      <option value="NL">
                                        Netherlands (USD $)
                                      </option>
                                      <option value="NZ">
                                        New Zealand (USD $)
                                      </option>
                                      <option value="NO">Norway (USD $)</option>
                                      <option value="PL">Poland (USD $)</option>
                                      <option value="PT">
                                        Portugal (USD $)
                                      </option>
                                      <option value="SG">
                                        Singapore (USD $)
                                      </option>
                                      <option value="KR">
                                        South Korea (USD $)
                                      </option>
                                      <option value="ES">Spain (USD $)</option>
                                      <option value="SE">Sweden (USD $)</option>
                                      <option value="CH">
                                        Switzerland (USD $)
                                      </option>
                                      <option value="AE">
                                        United Arab Emirates (USD $)
                                      </option>
                                      <option value="GB">
                                        United Kingdom (USD $)
                                      </option>
                                      <option value="US" selected>
                                        United States (USD $)
                                      </option>
                                    </select>
                                  </div>
                                  <button class="button button-tertiary">
                                    <span class="visually-hidden"
                                      >Update country/region</span
                                    >

                                    <span class="angle angle-right">
                                      <span class="angle-icon"></span>
                                    </span>
                                  </button></form
                              ></noscript>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </sticky-header>
    </div>

    <main id="MainContent" class="main focus-none" role="main" tabindex="-1">
      <div
        id="shopify-section-template--22972339028250__main"
        class="shopify-section product-info-wrap"
      >
        <link
          href="/utils/product_page_files/section-main-product.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-price.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-facets.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-rating.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-pills.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-tabs.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/component-tooltip.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />

        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-reviews.css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-deferred-media.css"
          media="all"
        />

        <noscript
          ><link
            href="//vinylbay777.com/cdn/shop/t/2/assets/component-reviews.css?v=100011643181345295991718583757"
            rel="stylesheet"
            type="text/css"
            media="all"
        /></noscript>
        <style>
          #shopify-section-template--22972339028250__main
            > .container
            > .block-section {
            margin-top: 50px;
            margin-bottom: 90px;
          }
        </style>

        <div class="container">
          <div class="block-section">
            <div class="product product-page product-page-expanded">
              <div class="product-media-gallery-wrap">
                <a
                  class="skip-link visually-hidden visually-hidden-focusable"
                  href="https://vinylbay777.com/products/reinhold-gliere-all-union-radio-orchestra-miroshnichenko-bolshoi-theatre-orchestra-ermler-gliere-conducts-gliere-symphony-no-2-1995-81-3002-new-sealed-cds#Product-template--22972339028250__main"
                  >Skip to product information</a
                >
                <media-gallery
                  id="MediaGallery-template--22972339028250__main"
                  role="region"
                  class="product-media-gallery"
                  aria-label="Gallery Viewer"
                  hide-variants="false"
                  style="position: relative"
                >
                  <div class="product-media-wrapper">
                    <div
                      class="product-media-main-wrapper media_main_slide slick-initialized slick-slider"
                    >
                      <button
                        class="slick-prev slick-arrow slick-disabled"
                        aria-label="Previous"
                        type="button"
                        aria-disabled="true"
                        style=""
                      >
                        Previous
                      </button>
                      <div class="slick-list draggable">
                        <div
                          class="slick-track"
                          style="
                            opacity: 1;
                            width: 742px;
                            transform: translate3d(0px, 0px, 0px);
                          "
                        >
                          <div
                            class="slick-slide slick-current slick-active"
                            data-slick-index="0"
                            aria-hidden="false"
                            style="width: 371px"
                          >
                            <div>
                              <div
                                class="product-media-main RRRR product-media is-active color-background-2"
                                data-media-id="40868543856922"
                                style="width: 100%; display: inline-block"
                              >
                                <noscript>
                                  <a
                                    href="//vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&width=1946"
                                  >
                                    <div
                                      class="aspect-ratio"
                                      style="
                                        --ratio-percent: 93.44344344344343%;
                                      "
                                    >
                                      <img
                                        src="//vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=1200"
                                        alt=""
                                        srcset="
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=200   200w,
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=420   420w,
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=550   550w,
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=750   750w,
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=950   950w,
                                          //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=1200 1200w
                                        "
                                        width="1200"
                                        height="1121"
                                        sizes="(min-width: 1200px) 550px, (min-width: 990px) calc(((100vw - 4rem) / 2) - 5rem), (min-width: 750px) calc(100vw - 6rem - (14% + 20px)), calc(100vw - 5rem)"
                                      />
                                    </div>
                                  </a>
                                </noscript>

                                <modal-opener
                                  class="product-modal-opener product-modal-opener-image image-zoom-type-lightbox no-js-hidden"
                                  data-modal="#ProductModal-template--22972339028250__main"
                                >
                                  <div
                                    class="aspect-ratio"
                                    style="--ratio-percent: 93.44344344344343%"
                                  >
                                    <img
                                      src="/utils/product_page_files/9d21e6ec455025b3eca50972ccfabf0b.jpg"
                                      alt=""
                                      srcset="
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=200   200w,
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=420   420w,
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=550   550w,
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=750   750w,
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=950   950w,
                                        //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=1200 1200w
                                      "
                                      width="1200"
                                      height="1121"
                                      class="no-js-hidden"
                                      sizes="(min-width: 1200px) 550px, (min-width: 990px) calc(((100vw - 4rem) / 2) - 5rem), (min-width: 750px) calc(100vw - 6rem - (14% + 20px)), calc(100vw - 5rem)"
                                      data-xblocker="passed"
                                      style="visibility: visible"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    class="product-media-toggle no-js-hidden"
                                    aria-haspopup="dialog"
                                    data-media-id="40868543856922"
                                    tabindex="0"
                                  >
                                    <span class="visually-hidden"
                                      >Open media 1 in modal</span
                                    >
                                  </button>

                                  <span
                                    class="product-media-icon-enlarge no-js-hidden"
                                  >
                                    Click To Enlarge
                                  </span>
                                </modal-opener>
                              </div>
                            </div>
                          </div>
                          <div
                            class="slick-slide"
                            data-slick-index="1"
                            aria-hidden="true"
                            style="width: 371px"
                            tabindex="-1"
                          >
                            <div>
                              <div
                                class="product-media-main SSSS product-media color-background-2"
                                data-media-id="40868543889690"
                                style="width: 100%; display: inline-block"
                              >
                                <noscript>
                                  <a
                                    href="//vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&width=1946"
                                  >
                                    <div
                                      class="aspect-ratio"
                                      style="
                                        --ratio-percent: 90.08428358948935%;
                                      "
                                    >
                                      <img
                                        src="//vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=1200"
                                        alt=""
                                        srcset="
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=200   200w,
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=420   420w,
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=550   550w,
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=750   750w,
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=950   950w,
                                          //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=1200 1200w
                                        "
                                        width="1200"
                                        height="1081"
                                        loading="lazy"
                                        sizes="(min-width: 1200px) 550px, (min-width: 990px) calc(((100vw - 4rem) / 2) - 5rem), (min-width: 750px) calc(100vw - 6rem - (14% + 20px)), calc(100vw - 5rem)"
                                      />
                                    </div>
                                  </a>
                                </noscript>

                                <modal-opener
                                  class="product-modal-opener product-modal-opener-image image-zoom-type-lightbox no-js-hidden"
                                  data-modal="#ProductModal-template--22972339028250__main"
                                >
                                  <div
                                    class="aspect-ratio"
                                    style="--ratio-percent: 90.08428358948935%"
                                  >
                                    <img
                                      src="/utils/product_page_files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg"
                                      alt=""
                                      srcset="
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=200   200w,
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=420   420w,
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=550   550w,
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=750   750w,
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=950   950w,
                                        //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=1200 1200w
                                      "
                                      width="1200"
                                      height="1081"
                                      loading="lazy"
                                      class="no-js-hidden"
                                      sizes="(min-width: 1200px) 550px, (min-width: 990px) calc(((100vw - 4rem) / 2) - 5rem), (min-width: 750px) calc(100vw - 6rem - (14% + 20px)), calc(100vw - 5rem)"
                                      data-xblocker="passed"
                                      style="visibility: visible"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    class="product-media-toggle no-js-hidden"
                                    aria-haspopup="dialog"
                                    data-media-id="40868543889690"
                                    tabindex="-1"
                                  >
                                    <span class="visually-hidden"
                                      >Open media 2 in modal</span
                                    >
                                  </button>

                                  <span
                                    class="product-media-icon-enlarge no-js-hidden"
                                  >
                                    Click To Enlarge
                                  </span>
                                </modal-opener>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        class="slick-next slick-arrow"
                        aria-label="Next"
                        type="button"
                        style=""
                        aria-disabled="false"
                      >
                        Next
                      </button>
                    </div>

                    <div class="product-media-thumbnails">
                      <div
                        class="product-media-thumbnail product-media is-active color-background-2"
                        data-media-id="40868543856922"
                      >
                        <noscript>
                          <a
                            href="//vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&width=1946"
                          >
                            <div
                              class="aspect-ratio"
                              style="--ratio-percent: 100%"
                            >
                              <img
                                src="//vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=450"
                                alt=""
                                srcset="
                                  //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=48   48w,
                                  //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=96   96w,
                                  //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=150 150w,
                                  //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=300 300w,
                                  //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=450 450w
                                "
                                width="450"
                                height="420"
                                sizes="min-width(750px) calc(((100vw * 0.45) - 4rem - 6rem - 4rem) / 7) , calc((100vw - 3rem - 5rem) / 6)"
                              />
                            </div>
                          </a>
                        </noscript>

                        <div
                          class="aspect-ratio no-js-hidden"
                          style="--ratio-percent: 100%"
                        >
                          <img
                            src="/utils/product_page_files/9d21e6ec455025b3eca50972ccfabf0b(1).jpg"
                            alt=""
                            srcset="
                              //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=48   48w,
                              //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=96   96w,
                              //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=150 150w,
                              //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=300 300w,
                              //vinylbay777.com/cdn/shop/files/9d21e6ec455025b3eca50972ccfabf0b.jpg?v=1731469891&amp;width=450 450w
                            "
                            width="450"
                            height="420"
                            class="no-js-hidden"
                            sizes="(min-width: 990px) calc(((100vw - 4rem) / 2) * 0.14), (min-width: 750px) calc((100vw - 3rem) * 0.14), calc((100vw - 3rem - 5rem) / 5)"
                            data-xblocker="passed"
                            style="visibility: visible"
                          />
                        </div>

                        <button
                          type="button"
                          class="product-media-toggle no-js-hidden"
                          aria-haspopup="dialog"
                          data-media-id="40868543856922"
                        >
                          <span class="visually-hidden"
                            >Load image 1 in gallery view</span
                          >
                        </button>
                      </div>

                      <div
                        class="product-media-thumbnail product-media color-background-2"
                        data-media-id="40868543889690"
                      >
                        <noscript>
                          <a
                            href="//vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&width=1946"
                          >
                            <div
                              class="aspect-ratio"
                              style="--ratio-percent: 100%"
                            >
                              <img
                                src="//vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=450"
                                alt=""
                                srcset="
                                  //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=48   48w,
                                  //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=96   96w,
                                  //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=150 150w,
                                  //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=300 300w,
                                  //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=450 450w
                                "
                                width="450"
                                height="405"
                                loading="lazy"
                                sizes="min-width(750px) calc(((100vw * 0.45) - 4rem - 6rem - 4rem) / 7) , calc((100vw - 3rem - 5rem) / 6)"
                              />
                            </div>
                          </a>
                        </noscript>

                        <div
                          class="aspect-ratio no-js-hidden"
                          style="--ratio-percent: 100%"
                        >
                          <img
                            src="/utils/product_page_files/f0b19bd6d49b7a7f5542408c20e4ed3f(1).jpg"
                            alt=""
                            srcset="
                              //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=48   48w,
                              //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=96   96w,
                              //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=150 150w,
                              //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=300 300w,
                              //vinylbay777.com/cdn/shop/files/f0b19bd6d49b7a7f5542408c20e4ed3f.jpg?v=1731469891&amp;width=450 450w
                            "
                            width="450"
                            height="405"
                            loading="lazy"
                            class="no-js-hidden"
                            sizes="(min-width: 990px) calc(((100vw - 4rem) / 2) * 0.14), (min-width: 750px) calc((100vw - 3rem) * 0.14), calc((100vw - 3rem - 5rem) / 5)"
                            data-xblocker="passed"
                            style="visibility: visible"
                          />
                        </div>

                        <button
                          type="button"
                          class="product-media-toggle no-js-hidden"
                          aria-haspopup="dialog"
                          data-media-id="40868543889690"
                        >
                          <span class="visually-hidden"
                            >Load image 2 in gallery view</span
                          >
                        </button>
                      </div>
                    </div>
                  </div>
                </media-gallery>

                <div class="product-media-gallery-message">
                  <div class="rte">
                    <p>
                      Please view images for exact product details and
                      condition.
                    </p>
                  </div>
                </div>
              </div>

              <div class="product-info-wrap-content">
                <div
                  id="Product-template--22972339028250__main"
                  class="product-info"
                >
                  <div class="product-info-main">
                    <div class="product-info-eyebrow">
                      <a
                        title="Consonance"
                        >Consonance</a
                      >
                    </div>

                    <h1 class="product-info-heading h2">
                      Reinhold Glière ‒ All-Union Radio Orchestra,
                      Miroshnichenko, Bolshoi Theatre Orchestra, Ermler - Gliere
                      Conducts Gliere, Symphony No. 2 - 1995 - 81-3002 New -
                      Sealed - CDs
                    </h1>

                    <div
                      id="ProductInfoMeta-template--22972339028250__main"
                      class="product-info-meta"
                    >
                      <div
                        id="ProductAvailability-template--22972339028250__main"
                        class="product-info-meta-item"
                      >
                        <div class="badge-stock badge-stock-in">
                          <span class="badge-stock-icon"></span>
                          <span class="js-stock-text"> In stock </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class=" "
                    id="price-template--22972339028250__main"
                    role="status"
                  >
                    <div class="price">
                      <div class="price-container">
                        <div class="price-regular">
                          <span class="visually-hidden">Regular price</span>
                          <span class="price-item price-item-regular">
                            $19.77
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form
                    method="post"
                    action="https://vinylbay777.com/cart/add"
                    id="product-form-installment"
                    accept-charset="UTF-8"
                    class="installment"
                    enctype="multipart/form-data"
                    data-event-context="MainProductPageInstallment"
                  >
                    <input
                      type="hidden"
                      name="form_type"
                      value="product"
                    /><input type="hidden" name="utf8" value="✓" /><input
                      type="hidden"
                      name="id"
                      value="49940748763418"
                    />

                    <input
                      type="hidden"
                      name="product-id"
                      value="9677669499162"
                    /><input
                      type="hidden"
                      name="section-id"
                      value="template--22972339028250__main"
                    />
                  </form>

                  <div
                    class="product-variants variants-hidden product-variants-color-scheme-button-secondary"
                  >
                    <noscript
                      class="product-form-noscript-wrapper-template--22972339028250__main"
                    >
                      <div class="product-form-input hidden">
                        <label
                          class="form-label"
                          for="Variants-template--22972339028250__main"
                          >Product variants</label
                        >
                        <select
                          name="id"
                          id="Variants-template--22972339028250__main"
                          class="select__select"
                          form="product-form-template--22972339028250__main"
                        >
                          <option selected="selected" value="49940748763418">
                            Default Title - $19.77
                          </option>
                        </select>
                      </div>
                    </noscript>
                  </div>

                  <link
                    href="/utils/product_page_files/component-drawer.css"
                    rel="stylesheet"
                    type="text/css"
                    media="all"
                  />
                  <link
                    href="/utils/product_page_files/component-pickup-availability.css"
                    rel="stylesheet"
                    type="text/css"
                    media="all"
                  />
                  <pickup-availability
                    class="product-pickup-availabilities no-js-hidden"
                    available=""
                    data-root-url="/"
                    data-variant-id="49940748763418"
                    data-has-only-default-variant="true"
                    ><pickup-availability-preview
                      class="pickup-availability-preview"
                      ><div class="pickup-availability-status-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.52397 2.25C6.1814 2.24996 5.86135 2.24992 5.59488 2.28179C5.29866 2.31721 4.98714 2.39941 4.70378 2.62065C4.42042 2.84189 4.26513 3.12417 4.15892 3.40295C4.06338 3.65374 3.98579 3.96424 3.90275 4.29658L2.68588 9.16407C2.64101 9.34353 2.60069 9.50478 2.57407 9.64035C2.54624 9.78208 2.52293 9.94413 2.53478 10.1186C2.58326 10.8325 3.06145 11.4449 3.74226 11.6651C3.90979 11.7193 4.07479 11.7357 4.21994 11.743C4.22982 11.7435 4.23984 11.744 4.25 11.7444L4.25 17.052C4.24997 17.9505 4.24995 18.6997 4.32991 19.2945C4.41432 19.9223 4.59999 20.4891 5.05546 20.9445C5.51093 21.4 6.07773 21.5857 6.70552 21.6701C7.30029 21.7501 8.04949 21.75 8.94794 21.75H15.052C15.9504 21.75 16.6997 21.7501 17.2945 21.6701C17.9223 21.5857 18.4891 21.4 18.9445 20.9445C19.4 20.4891 19.5857 19.9223 19.6701 19.2945C19.7501 18.6997 19.75 17.9505 19.75 17.0521L19.75 11.7444C19.7601 11.744 19.7702 11.7435 19.78 11.743C19.9252 11.7357 20.0902 11.7193 20.2577 11.6651C20.9385 11.4449 21.4167 10.8325 21.4652 10.1186C21.477 9.94413 21.4537 9.78208 21.4259 9.64035C21.3993 9.50477 21.3589 9.34351 21.3141 9.16404L20.0972 4.2966C20.0142 3.96425 19.9366 3.65374 19.841 3.40295C19.7348 3.12417 19.5795 2.84189 19.2962 2.62065C19.0128 2.39941 18.7013 2.31721 18.4051 2.28179C18.1386 2.24992 17.8186 2.24996 17.476 2.25H6.52397ZM18.25 11.7119C18.1884 11.7029 18.1287 11.6919 18.0703 11.6783C17.4366 11.5307 16.8837 11.1655 16.5001 10.6578C16.0064 11.3107 15.2314 11.7293 14.3693 11.7493C14.3373 11.75 14.3028 11.75 14.2582 11.75H14.2418C14.1972 11.75 14.1626 11.75 14.1306 11.7493C13.2686 11.7293 12.4937 11.3108 12 10.6579C11.5063 11.3108 10.7313 11.7293 9.86931 11.7493C9.83731 11.75 9.80276 11.75 9.75815 11.75H9.7418C9.6972 11.75 9.66264 11.75 9.63064 11.7493C8.76855 11.7293 7.9936 11.3107 7.49988 10.6578C7.11627 11.1655 6.56332 11.5307 5.92965 11.6783C5.8713 11.6919 5.81155 11.7029 5.75 11.7119V17C5.75 17.964 5.7516 18.6116 5.81654 19.0946C5.87858 19.5561 5.9858 19.7536 6.11612 19.8839C6.24644 20.0142 6.44393 20.1214 6.90539 20.1835C7.34544 20.2426 7.92202 20.2492 8.75 20.2499V16C8.75 15.0335 9.5335 14.25 10.5 14.25H13.5C14.4665 14.25 15.25 15.0335 15.25 16V20.2499C16.078 20.2492 16.6546 20.2426 17.0946 20.1835C17.5561 20.1214 17.7536 20.0142 17.8839 19.8839C18.0142 19.7536 18.1214 19.5561 18.1835 19.0946C18.2484 18.6116 18.25 17.964 18.25 17V11.7119ZM5.6269 3.80295L5.62777 3.80238C5.62839 3.80205 5.63203 3.80013 5.64044 3.79718C5.65871 3.79078 5.69758 3.78019 5.77298 3.77118C5.93958 3.75125 6.16829 3.75001 6.56153 3.75001H17.4384C17.8317 3.75001 18.0604 3.75125 18.227 3.77118C18.3024 3.78019 18.3412 3.79078 18.3595 3.79718C18.3679 3.80013 18.3716 3.80205 18.3722 3.80238L18.3731 3.80295L18.3738 3.80366C18.3743 3.80418 18.377 3.80724 18.3819 3.81469C18.3926 3.83086 18.4123 3.866 18.4393 3.93696C18.499 4.09376 18.5557 4.31534 18.6511 4.69684L19.8547 9.51129C19.905 9.71255 19.9357 9.83606 19.954 9.92934C19.9656 9.98837 19.9678 10.0149 19.9683 10.0216C19.9598 10.1198 19.8943 10.2039 19.8011 10.2362C19.7944 10.2374 19.7672 10.2418 19.7049 10.2449C19.6072 10.2498 19.476 10.25 19.2641 10.25C18.6898 10.25 18.5296 10.2451 18.4106 10.2174C18.0186 10.1261 17.6945 9.85157 17.54 9.47989C17.493 9.36686 17.4628 9.21461 17.3705 8.66128L17.3688 8.65117C17.3584 8.58822 17.3476 8.52354 17.3374 8.47283C17.3321 8.44627 17.3236 8.4063 17.3111 8.3637L17.3104 8.36136C17.3028 8.33501 17.2706 8.22417 17.1903 8.1124C16.8512 7.64024 16.1488 7.64024 15.8096 8.1124C15.7293 8.22417 15.6972 8.33501 15.6895 8.36136L15.6888 8.3637C15.6764 8.4063 15.6679 8.44627 15.6625 8.47283C15.6524 8.52354 15.6416 8.58812 15.6311 8.65107L15.5479 9.15052C15.5386 9.20631 15.5359 9.22186 15.5336 9.23396C15.4233 9.81283 14.9237 10.236 14.3346 10.2497C14.3223 10.25 14.3065 10.25 14.25 10.25C14.1934 10.25 14.1776 10.25 14.1653 10.2497C13.5762 10.236 13.0766 9.81283 12.9663 9.23396C12.964 9.22186 12.9614 9.20631 12.9521 9.15052L12.8688 8.65116C12.8584 8.58819 12.8476 8.52357 12.8374 8.47283C12.8321 8.44627 12.8236 8.4063 12.8111 8.3637L12.8104 8.36136C12.8028 8.33501 12.7706 8.22417 12.6903 8.1124C12.3512 7.64024 11.6488 7.64024 11.3096 8.1124C11.2293 8.22417 11.1972 8.33501 11.1895 8.36136L11.1888 8.3637C11.1764 8.4063 11.1679 8.44627 11.1625 8.47283C11.1524 8.52354 11.1416 8.58812 11.1311 8.65107L11.0479 9.15052C11.0386 9.20631 11.0359 9.22186 11.0336 9.23396C10.9233 9.81283 10.4237 10.236 9.83463 10.2497C9.82232 10.25 9.80654 10.25 9.74998 10.25C9.69342 10.25 9.67764 10.25 9.66533 10.2497C9.07621 10.236 8.57661 9.81283 8.46632 9.23396C8.46402 9.22186 8.46137 9.20631 8.45208 9.15052L8.36885 8.65116C8.35836 8.58821 8.34759 8.52355 8.33741 8.47283C8.33208 8.44627 8.32358 8.4063 8.31111 8.3637L8.31043 8.36136C8.30278 8.33501 8.27063 8.22417 8.19034 8.1124C7.85119 7.64024 7.14876 7.64024 6.80962 8.1124C6.72933 8.22417 6.69717 8.33502 6.68953 8.36136L6.68885 8.3637C6.67638 8.4063 6.66788 8.44627 6.66254 8.47283C6.65236 8.52358 6.64159 8.58821 6.6311 8.65119L6.62942 8.66128C6.5372 9.21461 6.50693 9.36686 6.45994 9.47989C6.30541 9.85157 5.98135 10.1261 5.58933 10.2174C5.47038 10.2451 5.31019 10.25 4.73589 10.25C4.52391 10.25 4.39279 10.2498 4.2951 10.2449C4.23275 10.2418 4.20557 10.2374 4.19884 10.2362C4.10572 10.2039 4.04021 10.1199 4.03169 10.0216C4.03213 10.015 4.03434 9.98856 4.04597 9.92934C4.06428 9.83606 4.09492 9.71255 4.14524 9.51129L5.34885 4.69684C5.44423 4.31534 5.50091 4.09376 5.56064 3.93696C5.58767 3.866 5.60737 3.83086 5.61802 3.81469C5.62291 3.80724 5.62567 3.80418 5.62614 3.80366L5.6269 3.80295ZM13.75 20.25H10.25V16C10.25 15.8619 10.3619 15.75 10.5 15.75H13.5C13.6381 15.75 13.75 15.8619 13.75 16V20.25Z"
                            fill="#001A72"
                          ></path>
                        </svg>
                      </div>

                      <div class="pickup-availability-info">
                        <p class="pickup-availability-title">
                          Pickup also available at
                          <span class="pickup-availability-title-location"
                            >101-14 Dupont Street</span
                          >
                        </p>
                        <p class="pickup-availability-time">
                          Usually ready in 2-4 days
                        </p>
                        <drawer-toggle
                          for="PickupAvailabilityDrawer"
                          tabindex="-1"
                        >
                          <button
                            id="ShowPickupAvailabilityDrawer"
                            class="pickup-availability-button button-text-link"
                            aria-haspopup="dialog"
                          >
                            View store information
                          </button>
                        </drawer-toggle>
                      </div>
                    </pickup-availability-preview></pickup-availability
                  >

                  <product-form class="product-form" data-hide-errors="false">
                    <div
                      class="product-form-error-message-wrapper form-status form-status-error"
                      role="alert"
                      hidden=""
                    >
                      <span class="product-form-error-message"></span>
                    </div>

                    <form
                      method="post"
                      action="https://vinylbay777.com/cart/add"
                      id="product-form-template--22972339028250__main"
                      accept-charset="UTF-8"
                      class="form"
                      enctype="multipart/form-data"
                      novalidate="novalidate"
                      data-type="add-to-cart-form"
                      data-stock-threshold="0"
                      data-event-context="MainProductPage"
                    >
                      <input
                        type="hidden"
                        name="form_type"
                        value="product"
                      /><input type="hidden" name="utf8" value="✓" />
                      <input type="hidden" name="id" value="49940748763418" />
                      <div class="product-actions">
                        <div
                          class="product-actions-add-to-cart product-actions-add-to-cart-solid product-actions-add-to-cart-quantity"
                        >
                          <quantity-input class="quantity-input">
                            <button
                              type="button"
                              name="minus"
                              class="quantity-input-button quantity-input-minus no-js-hidden"
                            >
                              −
                              <span class="visually-hidden"
                                >Decrease quantity for Reinhold Glière ‒
                                All-Union Radio Orchestra, Miroshnichenko,
                                Bolshoi Theatre Orchestra, Ermler - Gliere
                                Conducts Gliere, Symphony No. 2 - 1995 - 81-3002
                                New - Sealed - CDs</span
                              >
                            </button>
                            <label
                              for="quantity-input-template--22972339028250__main"
                              class="visually-hidden"
                              >Quantity</label
                            >
                            <input
                              name="quantity"
                              type="number"
                              class="quantity-input-field"
                              id="quantity-input-template--22972339028250__main"
                              min="1"
                              max="8"
                              value="1"
                              form="product-form-template--22972339028250__main"
                            />
                            <button
                              type="button"
                              name="plus"
                              class="quantity-input-button quantity-input-plus no-js-hidden"
                            >
                              +
                              <span class="visually-hidden"
                                >Increase quantity for Reinhold Glière ‒
                                All-Union Radio Orchestra, Miroshnichenko,
                                Bolshoi Theatre Orchestra, Ermler - Gliere
                                Conducts Gliere, Symphony No. 2 - 1995 - 81-3002
                                New - Sealed - CDs</span
                              >
                            </button> </quantity-input
                          ><button
                            type="submit"
                            name="add"
                            class="button button-secondary button-add-to-cart"
                          >
                            <span>Add to cart</span>
                            <div class="button-overlay-spinner hidden">
                              <span class="spinner-xs"></span>
                            </div>
                          </button>
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="product-id"
                        value="9677669499162"
                      /><input
                        type="hidden"
                        name="section-id"
                        value="template--22972339028250__main"
                      />
                    </form>
                  </product-form>

                  <div class="custom-liquid-right">
                    <strong style="font-size: 20px"
                      >Available Quantity: 8</strong
                    >
                  </div>
                </div>
              </div>

              <div class="product-info-sidebar">
                <div
                  id="ProductInfoDetails-template--22972339028250__main-details-7"
                  class="product-info-details"
                >
                  <h4 class="product-info-details-title h5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H15C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H9C8.58579 12.75 8.25 12.4142 8.25 12Z"
                        fill="#001A72"
                      ></path>
                      <path
                        d="M9 15.25C8.58579 15.25 8.25 15.5858 8.25 16C8.25 16.4142 8.58579 16.75 9 16.75H15C15.4142 16.75 15.75 16.4142 15.75 16C15.75 15.5858 15.4142 15.25 15 15.25H9Z"
                        fill="#001A72"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.35424 4.25C8.48112 3.80245 8.72067 3.39024 9.05546 3.05546C9.57118 2.53973 10.2707 2.25 11 2.25H13C13.7293 2.25 14.4288 2.53973 14.9445 3.05546C15.2793 3.39024 15.5189 3.80245 15.6458 4.25H17C17.7293 4.25 18.4288 4.53973 18.9445 5.05546C19.4603 5.57118 19.75 6.27065 19.75 7V19C19.75 19.7293 19.4603 20.4288 18.9445 20.9445C18.4288 21.4603 17.7293 21.75 17 21.75H7C6.27065 21.75 5.57118 21.4603 5.05546 20.9445C4.53973 20.4288 4.25 19.7293 4.25 19V7C4.25 6.27065 4.53973 5.57118 5.05546 5.05546C5.57118 4.53973 6.27065 4.25 7 4.25H8.35424ZM10.1161 4.11612C10.3505 3.8817 10.6685 3.75 11 3.75H13C13.3315 3.75 13.6495 3.8817 13.8839 4.11612C14.1183 4.35054 14.25 4.66848 14.25 5C14.25 5.33152 14.1183 5.64946 13.8839 5.88388C13.6495 6.1183 13.3315 6.25 13 6.25H11C10.6685 6.25 10.3505 6.1183 10.1161 5.88388C9.8817 5.64946 9.75 5.33152 9.75 5C9.75 4.66848 9.8817 4.35054 10.1161 4.11612ZM15.6458 5.75H17C17.3315 5.75 17.6495 5.8817 17.8839 6.11612C18.1183 6.35054 18.25 6.66848 18.25 7V19C18.25 19.3315 18.1183 19.6495 17.8839 19.8839C17.6495 20.1183 17.3315 20.25 17 20.25H7C6.66848 20.25 6.35054 20.1183 6.11612 19.8839C5.8817 19.6495 5.75 19.3315 5.75 19V7C5.75 6.66848 5.8817 6.35054 6.11612 6.11612C6.35054 5.8817 6.66848 5.75 7 5.75H8.35424C8.48112 6.19755 8.72067 6.60976 9.05546 6.94454C9.57118 7.46027 10.2707 7.75 11 7.75H13C13.7293 7.75 14.4288 7.46027 14.9445 6.94454C15.2793 6.60976 15.5189 6.19755 15.6458 5.75Z"
                        fill="#001A72"
                      ></path>
                    </svg>

                    Product details
                  </h4>

                  <ul class="product-info-details-list">
                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Artist:</span
                      >
                      <span class="product-info-details-item-value"
                        >Reinhold Glière ‒ All-Union Radio Orchestra,
                        Miroshnichenko, Bolshoi Theatre Orchestra, Ermler</span
                      >
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Title:</span
                      >
                      <span class="product-info-details-item-value"
                        >Gliere Conducts Gliere, Symphony No. 2</span
                      >
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label">
                        Condition:
                      </span>
                      <span class="product-info-details-item-value">New</span>
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label">
                        Grade:
                      </span>
                      <span class="product-info-details-item-value"
                        >Sealed</span
                      >
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Catalog #:</span
                      >
                      <span class="product-info-details-item-value"
                        >81-3002</span
                      >
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Record label:</span
                      >
                      <span class="product-info-details-item-value"
                        >Consonance</span
                      >
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label">
                        Release year:
                      </span>
                      <span class="product-info-details-item-value">1995</span>
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Country of manufacture:</span
                      >
                      <span class="product-info-details-item-value">US</span>
                    </li>

                    <li class="product-info-details-item">
                      <span class="product-info-details-item-label"
                        >Genre:</span
                      >
                      <span class="product-info-details-item-value"
                        >Classical</span
                      >
                    </li>
                  </ul>
                </div>

                ${isVertical === true ? `<img src="${src}" width="400" height="auto" id="banner_vertical" style="cursor: pointer; margin-bottom: 30px; margin-left: auto; margin-right: auto;" onclick="redirectToParent('${link}'); return false;" />` : ""}
              </div>

              <div class="product-info-description">
                <div class="product-info-description-content">
                  <tabs-navigation
                    for="TabComponent-template--22972339028250__main"
                    class="product-tab-navigation"
                  >
                    <div class="tab-nav-wrap">
                      <div class="tab-nav">
                        <a
                          href="https://vinylbay777.com/products/reinhold-gliere-all-union-radio-orchestra-miroshnichenko-bolshoi-theatre-orchestra-ermler-gliere-conducts-gliere-symphony-no-2-1995-81-3002-new-sealed-cds#"
                          class="tab-nav-item is-active"
                          data-handle="template--22972339028250__main-description-8"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.25 7.00999C11.25 7.42421 11.5858 7.75999 12 7.75999C12.4142 7.75999 12.75 7.42421 12.75 7.00999H11.25ZM12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7H12.75ZM11.25 17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17H11.25ZM12.75 10C12.75 9.58579 12.4142 9.25 12 9.25C11.5858 9.25 11.25 9.58579 11.25 10H12.75ZM12.75 7.00999V7H11.25V7.00999H12.75ZM12.75 17L12.75 10H11.25L11.25 17H12.75ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"
                            ></path>
                          </svg>

                          Description
                        </a>
                      </div>
                    </div>
                  </tabs-navigation>

                  <tabs-component
                    id="TabComponent-template--22972339028250__main"
                    class="product-tabs-component"
                  >
                    <div
                      class="tabs-component-content color-background-2"
                      data-handle="template--22972339028250__main-description-8"
                      aria-hidden="false"
                    >
                      <div class="rte">
                        <p>
                          Reinhold Glière ‒ All-Union Radio Orchestra,
                          Miroshnichenko, Bolshoi Theatre Orchestra, Ermler
                        </p>
                        <p>Gliere Conducts Gliere, Symphony No. 2</p>
                        <p>1995</p>
                        <p>81-3002</p>
                        <p>New</p>
                        <p>Sealed</p>
                        <p>CDs</p>
                      </div>
                    </div>
                  </tabs-component>
                </div>
              </div>
            </div>
            <div class="vinylbay-ads">
              ${isVertical === false ? `<img id="banner_horizontal" src="${src}" height="auto" width="auto" style="cursor: pointer; margin-top: 20px;" onclick="redirectToParent('${link}'); return false;" />` : ""}
            </div>
            <script>
              const adjustHorizontalImageHeight = () => {
                const horizontalImage = document.getElementById("banner_horizontal");
                const verticalImage = document.querySelector("div.product-info-details");

                if(!horizontalImage) return;

                if(verticalImage.offsetWidth < 400) {
                  horizontalImage.style.height = verticalImage.offsetWidth + 'px';
                } else {
                 horizontalImage.style.height = '400px';
                }
              }

              window.onload = adjustHorizontalImageHeight;
              window.onresize = adjustHorizontalImageHeight;
            </script>
          </div>
        </div>
      </div>
      <div
        id="shopify-section-template--22972339028250__recommendations"
        class="shopify-section product-info-recommendations"
      >
        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-card.css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-price.css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-scroller.css"
          media="all"
        />

        <noscript
          ><link
            href="//vinylbay777.com/cdn/shop/t/2/assets/component-card.css?v=16441007466810233441719424292"
            rel="stylesheet"
            type="text/css"
            media="all"
        /></noscript>
        <noscript
          ><link
            href="//vinylbay777.com/cdn/shop/t/2/assets/component-price.css?v=154262556076350464081718583757"
            rel="stylesheet"
            type="text/css"
            media="all"
        /></noscript>
        <noscript
          ><link
            href="//vinylbay777.com/cdn/shop/t/2/assets/component-scroller.css?v=161446552095275548261718583757"
            rel="stylesheet"
            type="text/css"
            media="all"
        /></noscript>

        <style>
          #shopify-section-template--22972339028250__recommendations
            .block-section {
            margin-top: 72px;
            margin-bottom: 72px;
          }

          #shopify-section-template--22972339028250__recommendations
            .block-section-padded {
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 72px;
            padding-bottom: 72px;
          }

          @media (min-width: 990px) {
            #shopify-section-template--22972339028250__recommendations
              .block-section {
              margin-top: 90px;
              margin-bottom: 90px;
            }

            #shopify-section-template--22972339028250__recommendations
              .block-section-padded {
              margin-top: 0;
              margin-bottom: 0;
              padding-top: 90px;
              padding-bottom: 90px;
            }
          }
        </style>

        
      </div>
    </main>

    <footer class="footer">
      <div
        id="shopify-section-sections--22972339323162__features"
        class="shopify-section shopify-section-group-footer-group section-features"
      >
        <link
          href="/utils/product_page_files/component-card.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          href="/utils/product_page_files/section-features.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />

        <style>
          #shopify-section-sections--22972339323162__features .block-section {
            margin-top: 40px;
            margin-bottom: 40px;
          }

          #shopify-section-sections--22972339323162__features
            .block-section-padded {
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 40px;
            padding-bottom: 40px;
          }

          @media (min-width: 990px) {
            #shopify-section-sections--22972339323162__features .block-section {
              margin-top: 50px;
              margin-bottom: 50px;
            }

            #shopify-section-sections--22972339323162__features
              .block-section-padded {
              margin-top: 0;
              margin-bottom: 0;
              padding-top: 50px;
              padding-bottom: 50px;
            }
          }
        </style>

        <div
          class="section-features-wrapper section-features-wrapper-fullwidth color-accent-2"
        >
          <div class="media-icon-items media-icon-items-size-large">
            <div class="container">
              <div class="block-section block-section-padded">
                <div class="media-icon-items-grid media-icon-items-grid-4">
                  <div class="media-icon-item">
                    <span class="media-icon-item-icon">
                      <img
                        src="/utils/product_page_files/icon1.png"
                        srcset="
                          //vinylbay777.com/cdn/shop/files/icon1.png?v=1719478834&amp;width=40 1x,
                          //vinylbay777.com/cdn/shop/files/icon1.png?v=1719478834&amp;width=80 2x
                        "
                        alt=""
                        width="15"
                        height="15"
                        loading="lazy"
                      />
                    </span>

                    <div class="media-icon-item-content">
                      <p class="media-icon-item-title h5">Expert Help</p>

                      <div class="media-icon-item-subtitle">
                        <h3>Have a question? Give us a call!</h3>
                      </div>
                    </div>
                  </div>

                  <div class="media-icon-item">
                    <span class="media-icon-item-icon">
                      <img
                        src="/utils/product_page_files/icon2.png"
                        srcset="
                          //vinylbay777.com/cdn/shop/files/icon2.png?v=1719478834&amp;width=40 1x,
                          //vinylbay777.com/cdn/shop/files/icon2.png?v=1719478834&amp;width=80 2x
                        "
                        alt=""
                        width="15"
                        height="15"
                        loading="lazy"
                      />
                    </span>

                    <div class="media-icon-item-content">
                      <p class="media-icon-item-title h5">Special Orders</p>

                      <div class="media-icon-item-subtitle">
                        <h3>
                          Looking for something special? We can help you find
                          it.
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div class="media-icon-item">
                    <span class="media-icon-item-icon">
                      <img
                        src="/utils/product_page_files/icon3.png"
                        srcset="
                          //vinylbay777.com/cdn/shop/files/icon3.png?v=1719478834&amp;width=40 1x,
                          //vinylbay777.com/cdn/shop/files/icon3.png?v=1719478834&amp;width=80 2x
                        "
                        alt=""
                        width="17"
                        height="17"
                        loading="lazy"
                      />
                    </span>

                    <div class="media-icon-item-content">
                      <p class="media-icon-item-title h5">Artists Wanted</p>

                      <div class="media-icon-item-subtitle">
                        <h3>Have a creative side? We want to sell your art!</h3>
                      </div>
                    </div>
                  </div>

                  <div class="media-icon-item">
                    <span class="media-icon-item-icon">
                      <img
                        src="/utils/product_page_files/icon4.png"
                        srcset="
                          //vinylbay777.com/cdn/shop/files/icon4.png?v=1719478834&amp;width=40 1x,
                          //vinylbay777.com/cdn/shop/files/icon4.png?v=1719478834&amp;width=80 2x
                        "
                        alt=""
                        width="13"
                        height="13"
                        loading="lazy"
                      />
                    </span>

                    <div class="media-icon-item-content">
                      <p class="media-icon-item-title h5">We Buy Collections</p>

                      <div class="media-icon-item-subtitle">
                        <h3>From records to artwork, we buy it all!</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="shopify-section-sections--22972339323162__footer"
        class="shopify-section shopify-section-group-footer-group section-footer"
      >
        <link
          href="/utils/product_page_files/section-footer.css"
          rel="stylesheet"
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-list-payment.css"
          media="all"
        />

        <noscript
          ><link
            href="//vinylbay777.com/cdn/shop/t/2/assets/component-list-payment.css?v=54670016387120427331718583757"
            rel="stylesheet"
            type="text/css"
            media="all"
        /></noscript>

        <link
          rel="stylesheet"
          href="/utils/product_page_files/component-button-top.css"
          media="all"
        />

        <div class="footer-blocks color-accent-3">
          <div class="container">
            <div
              class="footer-blocks-wrapper grid grid-1-col grid-4-col-tablet"
            >
              <div class="grid-item">
                <style>
                  .widget-media-footer-0 {
                    max-width: 140px;
                  }
                </style>
                <figure class="widget-media widget-media-footer-0">
                  <img
                    src="/utils/product_page_files/Vinyl_Bay_777_logo_1(1).png"
                    alt=""
                    width="1694"
                    height="821"
                    srcset="
                      //vinylbay777.com/cdn/shop/files/Vinyl_Bay_777_logo_1.png?v=1719582499&amp;width=140 1x,
                      //vinylbay777.com/cdn/shop/files/Vinyl_Bay_777_logo_1.png?v=1719582499&amp;width=280 2x
                    "
                    loading="lazy"
                  />
                </figure>

                <div class="rte">
                  <p>The new, the old, the hard-to-find...</p>
                  <p>We are Your Music Outlet.</p>
                </div>
              </div>

              <div class="grid-item">
                <h3 class="widget-title">General</h3>

                <ul class="list-unstyled">
                  <li>
                    <a
                      class="link-text"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Refunds &amp; Returns
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>

              <div class="grid-item">
                <h3 class="widget-title">Shop</h3>

                <ul class="list-unstyled">
                  <li>
                    <a
                      class="link-text"
                    >
                      Vinyl
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Collectibles
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Art
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-text"
                    >
                      Shop It All
                    </a>
                  </li>
                </ul>
              </div>

              <div class="grid-item">
                <h3 class="widget-title">Newsletter</h3>

                <div class="footer-newsletter">
                  <div class="newsletter-description rte">
                    <p>
                      Subscribe to our newsletter and receive special offers
                    </p>
                  </div>

                  <form
                    id="contact_form"
                    accept-charset="UTF-8"
                    class="newsletter-form"
                  >
                    <input
                      type="hidden"
                      name="form_type"
                      value="customer"
                    /><input type="hidden" name="utf8" value="✓" /><input
                      type="hidden"
                      name="contact[tags]"
                      value="newsletter"
                    />

                    <div class="newsletter-form-input-wrap">
                      <label
                        for="form-newsletter-email-sections--22972339323162__footer-3"
                        class="visually-hidden"
                        >Your email</label
                      >
                      <input
                        type="email"
                        pattern=".+@.+.(.+.?)+"
                        name="contact[email]"
                        id="form-newsletter-email-sections--22972339323162__footer-3"
                        placeholder="Your email"
                        autocorrect="off"
                        autocapitalize="off"
                        autocomplete="email"
                        value=""
                        required=""
                      />
                      <button type="submit" class="button">Subscribe</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-info-wrapper color-accent-3">
          <div class="container">
            <div class="footer-info">
              <div class="footer-info-start">
                <span class="visually-hidden">Payment methods</span>
                <ul class="list-inline-menu list-payment" role="list"></ul>
              </div>
              <div class="footer-info-end">
                <div class="footer-social-links-wrap">
                  <ul class="list-inline-menu list-social" role="list">
                    <li class="list-social-item">
                      <a
                        class="list-social-link"
                        target="_blank"
                      >
                        <svg
                          width="6"
                          height="10"
                          viewBox="0 0 6 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.35931 5.84375H4.75L5.00993 4.11792H3.35931V3.00431C3.35931 2.75713 3.43363 2.5469 3.58229 2.37361C3.71775 2.18801 3.97109 2.08905 4.34229 2.07674H5.08514V0.610833C5.07282 0.610833 4.93032 0.592361 4.65764 0.555417C4.39815 0.518472 4.09512 0.5 3.74854 0.5C3.06859 0.5 2.52454 0.697917 2.11639 1.09375C1.72056 1.48958 1.51648 2.06486 1.50417 2.81958V4.11792H0V5.84375H1.50417V10H3.35931V5.84375Z"
                            fill="black"
                          ></path>
                        </svg>

                        <span class="visually-hidden">Facebook</span>
                      </a>
                    </li>

                    <li class="list-social-item">
                      <a
                        class="list-social-link"
                        target="_blank"
                      >
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70313 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3313 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2813 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
                            fill="black"
                          ></path>
                          <path
                            d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
                            fill="black"
                          ></path>
                          <path
                            d="M39.6937 11.1843C39.6937 12.778 38.4 14.0624 36.8156 14.0624C35.2219 14.0624 33.9375 12.7687 33.9375 11.1843C33.9375 9.59054 35.2313 8.30616 36.8156 8.30616C38.4 8.30616 39.6937 9.59991 39.6937 11.1843Z"
                            fill="black"
                          ></path>
                        </svg>

                        <span class="visually-hidden">Instagram</span>
                      </a>
                    </li>

                    <li class="list-social-item">
                      <a
                        class="list-social-link"
                        target="_blank"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="50"
                          viewBox="0 0 48 50"
                        >
                          <path
                            fill-rule="nonzero"
                            d="M28.567 20.771 46.436 0H42.2L26.685 18.035 14.293 0H0l18.74 27.273L0 49.055h4.235L20.62 30.009l13.087 19.046H48L28.565 20.77h.002Zm-5.8 6.742-1.9-2.716L5.76 3.187h6.505l12.191 17.44 1.9 2.716 15.847 22.669H35.7L22.767 27.514Z"
                          ></path>
                        </svg>

                        <span class="visually-hidden"> X </span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="footer-info-copy">
                  © 2024
                  <a title="">Vinyl Bay 777</a>.
                  All right reserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    if (name === "isVertical")
      setAdData({
        ...adData,
        [name]: value === "true" ? true : value === "false" ? false : null,
      });
    else setAdData({ ...adData, [name]: value });
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
      case "link":
        if (!value.trim()) error = "Link is required";
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(value))
          error = "Please enter a valid URL";
        break;
      case "isVertical":
        if (value === null) error = "Banner location is required";
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
    if (!adData.link.trim()) newErrors.link = "Link is required";
    if (adData.isVertical === null || adData.isVertical === undefined)
      newErrors.isVertical = "Banner location is required";

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

      if (id && id !== "") uploadingData.id = id;
      try {
        await Axios.post("/ads/submit", uploadingData, {
          withCredentials: true,
        });
        enqueueSnackbar("Successfully submitted!", {
          variant: "success",
        });
        setIsAlreadySetup(true);
        navigate("/dashboard");
      } catch (error) {
        if (error.response && error.response.status === 403) {
          enqueueSnackbar("Your token is invalid or expired", {
            variant: "error",
          });
          return navigate("/authentication/login");
        }
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

  const remove = async () => {
    if (!id || id === "") return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      await Axios.delete(`/ads/${id}`, { withCredentials: true });
      setAdData({ banner: null, link: "", isVertical: null });
      if (bannerInputRef.current) bannerInputRef.current.value = null;
      setIsAlreadySetup(false);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        enqueueSnackbar("Your token is invalid or expired", {
          variant: "error",
        });
        return navigate("/authentication/login");
      }
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
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          padding: "70px 30px",
        })}
        open={preview}
        onClick={() => setPreview(false)}
      >
        <iframe
          srcDoc={htmlContent()}
          // height="1000px"
          width="100%"
          height="100%"
          title="Iframe with Script"
          style={
            {
              // border: "none",
            }
          }
        ></iframe>
      </Backdrop>
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
      <Typography
        variant="h4"
        fontWeight={900}
        gutterBottom
        display="flex"
        alignItems="center"
      >
        <Typography variant="label" color="orange">
          1.{" "}
        </Typography>
        Choose your advertising plan.{" "}
        {isPurchased ? (
          <CheckIcon sx={{ fontSize: 50, fontWeight: 900, color: "green" }} />
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate("/plans")}
          >
            View Plans
          </Button>
        )}
      </Typography>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        <Typography variant="label" color="orange">
          2.{" "}
        </Typography>
        Upload your ad.
      </Typography>
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
          ref={bannerInputRef}
        />
        <label htmlFor="banner-upload">
          <Box display="flex" flexDirection="column" alignItems="center">
            {!(adData.banner instanceof File) &&
            (typeof adData.banner !== "string" || adData.banner === "") ? (
              <FileUploadIcon style={{ color: "#757575", fontSize: 48 }} />
            ) : (
              ""
            )}

            <Typography variant="body1" mt={2}>
              {adData.banner instanceof File ||
              (typeof adData.banner === "string" && adData.banner !== "") ? (
                <img
                  src={
                    adData.banner instanceof File
                      ? URL.createObjectURL(adData.banner)
                      : typeof adData.banner === "string"
                        ? adData.banner
                        : ""
                  }
                  width="100%"
                  height={200}
                  alt={
                    adData.banner instanceof File
                      ? adData.banner.name
                      : typeof adData.banner === "string" &&
                          adData.banner !== ""
                        ? adData.banner
                        : "Drag & Drop or Click to Upload Banner"
                  }
                />
              ) : (
                "Drag & Drop or Click to Upload Banner"
              )}

              {/* {adData.banner && adData.banner.name
                ? adData.banner.name
                : "Drag & Drop or Click to Upload Banner"} */}
            </Typography>
          </Box>
        </label>
      </DragDropArea>
      {errors.banner && <ErrorText>{errors.banner}</ErrorText>}
      <br />
      <Typography variant="h4" fontWeight={900} gutterBottom>
        <Typography variant="label" color="orange">
          3.{" "}
        </Typography>
        Add your link.
      </Typography>
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

      <Typography variant="h4" fontWeight={900} gutterBottom>
        <Typography variant="label" color="orange">
          4.{" "}
        </Typography>
        Choose your banner style & location.
      </Typography>
      <FormControl sx={{ marginBottom: 2 }}>
        <FormLabel id="banner-location">Banner location</FormLabel>
        <RadioGroup
          aria-labelledby="banner-location"
          onChange={handleInputChange}
          name="isVertical"
          value={adData.isVertical}
          row
        >
          <FormControlLabel value={true} control={<Radio />} label="Vertical" />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Horizontal"
          />
        </RadioGroup>
        <FormHelperText error>{errors.isVertical}</FormHelperText>
      </FormControl>

      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
        marginBottom={5}
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
            variant="contained"
            color="error"
            size="large"
            disabled={isLoading}
            startIcon={<DeleteIcon />}
            onClick={remove}
          >
            Remove
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          size="large"
          disabled={isLoading}
          startIcon={<VisibilityIcon />}
          onClick={() => setPreview((preview) => !preview)}
        >
          Preview
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {/* <iframe
            srcDoc={htmlContent()}
            width="100%"
            height="100%"
            title="Iframe with Script"
            style={{ border: "none" }}
          ></iframe> */}
          {/* <iframe
            srcDoc={htmlContent()}
            height="1000px"
            title="Iframe with Script"
            style={{
              border: "none",
              width: "125%",
              height: "1250px",
              transform: "scale(0.8)",
              transformOrigin: "top left",
              marginBottom: "-250px",
            }}
          ></iframe> */}
        </Grid>
      </Grid>
    </AdSetupForm>
  );
};

export default Ad;
