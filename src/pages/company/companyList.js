import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Pagination,
  // Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import BanIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Axios } from "../../utils/utils";
import { useSnackbar } from "notistack";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const CompanyList = ({ navigate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    Axios.get("/company", { withCredentials: true })
      .then((res) => {
        const { companyList } = res.data;
        setCompanies(companyList);
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
  }, [navigate, enqueueSnackbar]);

  const totalPages = Math.ceil(companies.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
  };

  const handleRemoveCompany = async () => {
    if (selectedCompany) {
      setIsLoading(true);
      try {
        const res = await Axios.delete(
          `/company/${selectedCompany.id}/remove`,
          {
            withCredentials: true,
          }
        );
        enqueueSnackbar(res.data.message, {
          variant: "success",
        });
        setCompanies(
          companies.filter((company) => company.id !== selectedCompany.id)
        );

        setOpenDialog(false);
        setSelectedCompany(null);
      } catch (error) {
        console.log(error);
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Server error", {
            variant: "error",
          });
        }
      }

      setIsLoading(false);
    }
  };

  const handleBlockCompany = async (id) => {
    setIsLoading(true);
    try {
      const res = await Axios.get(
        `/company/${id}/${companies.find((company) => company.id === id).blocked ? "unblock" : "block"}`,
        { withCredentials: true }
      );
      enqueueSnackbar(res.data.message, {
        variant: "success",
      });
      setCompanies(
        companies.map((company) =>
          company.id === id
            ? { ...company, blocked: !company.blocked }
            : company
        )
      );
    } catch (error) {
      console.log(error);
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      }
    }

    setIsLoading(false);
  };

  const displayedCompanies = companies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={itemsPerPage}
            label="Rows per page"
            onChange={handleRowsPerPageChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Company</StyledTableCell>
              {!isMobile && <StyledTableCell>Email</StyledTableCell>}
              <StyledTableCell align="center">Ads</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCompanies.map((company) => (
              <TableRow
                key={company.id}
                sx={{
                  backgroundColor: company.blocked
                    ? "rgba(0, 0, 0, 0.04)"
                    : "inherit",
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: 2,
                    }}
                  >
                    {/* <Avatar
                      src={company.logo}
                      alt={company.name}
                      sx={{ width: 40, height: 40 }}
                    /> */}
                    <Box>
                      <Typography>{company.name}</Typography>
                      {isMobile && (
                        <Typography variant="body2" color="textSecondary">
                          {company.email}
                        </Typography>
                      )}
                    </Box>
                    {/* {company.blocked && (
                      <BanIcon
                        color="error"
                        size={20}
                        style={{ marginLeft: 8 }}
                      />
                    )} */}
                  </Box>
                </TableCell>
                {!isMobile && <TableCell>{company.email}</TableCell>}
                <TableCell align="center">{company.adsCount}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Remove Company">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedCompany(company);
                        setOpenDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      company.blocked ? "Unblock Company" : "Block Company"
                    }
                  >
                    <IconButton
                      color={company.blocked ? "success" : "warning"}
                      onClick={() => handleBlockCompany(company.id)}
                    >
                      {company.blocked ? <LockOpenIcon /> : <BanIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to remove {selectedCompany?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRemoveCompany}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyList;
