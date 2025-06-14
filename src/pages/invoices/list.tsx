import React, { useState, useEffect } from "react";
import {
  List,
  useDataGrid,
  DateField,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMany, useDelete, useCustomMutation, useInvalidate, useList } from "@refinedev/core";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Button,
  TextField,
  Typography,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

// Define interface for invoice row data
interface InvoiceRowData {
  id: string;
  companyId: string;
  clientId: string;
  paymentMethodId: string;
  status: string;
  date: string;
  dueDate: string;
  subtotal: number;
  no?: number; // Optional property for row numbering
}

// Define filter interface based on your DTO
interface InvoiceFilter {
  status?: string;
  month?: string;
  paymentMethodId?: string;
  companyId?: string;
  clientId?: string;
}

export const InvoiceList: React.FC = () => {
  // State for tracking data refresh
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State for filters
  const [filters, setFilters] = useState<InvoiceFilter>({});
  
  // State for selections and actions
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] = useState<string | null>(null);
  
  // Create an array of month options
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Status options
  const statusOptions = [
    { value: "PAID", label: "Paid" },
    { value: "UNPAID", label: "Unpaid" },
    { value: "CANCELED", label: "Canceled" },
    { value: "pending", label: "Pending" },
  ];

  // Prepare filters for dataGrid
  const permanentFilters = [];
  if (filters.status) {
    permanentFilters.push({
      field: "status",
      operator: "eq",
      value: filters.status,
    });
  }
  
  // Add month filter (using month field with YYYY-M format)
  if (filters.month) {
    const currentYear = new Date().getFullYear();
    const monthNumber = parseInt(filters.month, 10); // Convert "01" to 1, "02" to 2, etc.
    permanentFilters.push({
      field: "month", // Changed from "date" to "month"
      operator: "eq",
      value: `${currentYear}-${monthNumber}`, // Format: YYYY-M (e.g. 2025-4 for April)
    });
  }
  
  // Add payment method filter
  if (filters.paymentMethodId) {
    permanentFilters.push({
      field: "paymentMethodId",
      operator: "eq",
      value: filters.paymentMethodId,
    });
  }
  
  // Add company filter
  if (filters.companyId) {
    permanentFilters.push({
      field: "companyId",
      operator: "eq",
      value: filters.companyId,
    });
  }
  
  // Add client filter
  if (filters.clientId) {
    permanentFilters.push({
      field: "clientId",
      operator: "eq",
      value: filters.clientId,
    });
  }

  // Create dataGridProps with filters
  const { dataGridProps } = useDataGrid({
    filters: {
      permanent: permanentFilters,
    }
  });

  // For manual data refresh
  const { refetch } = useList({
    resource: "invoice",
    queryOptions: {
      enabled: true, // Always enabled
    },
  });
  
  // For invalidating and refreshing data
  const invalidate = useInvalidate();

  // Define custom mutations
  const navigate = useNavigate();
  const { mutate: deleteInvoice } = useDelete();
  const { mutate: markAsPaid } = useCustomMutation();
  const { mutate: sendEmail, isLoading: isSendingEmail } = useCustomMutation();

  // For the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [actionRow, setActionRow] = React.useState<InvoiceRowData | null>(null);
  const open = Boolean(anchorEl);

  // Handle filter changes
  const handleFilterChange = (field: keyof InvoiceFilter, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, row: InvoiceRowData) => {
    setAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (actionRow?.id) {
      navigate(`/invoice/edit/${actionRow.id}`);
      handleMenuClose();
    }
  };

  const handlePaid = () => {
    if (actionRow) {
      console.log(`Marking invoice ${actionRow.id} as paid`);
      
      markAsPaid(
        {
          url: `/api/invoice/mark-as-paid/${actionRow.id}`,
          method: 'patch',
          values: {}, // Add an empty values object
          successNotification: {
            message: 'Invoice marked as paid successfully',
            type: 'success',
          },
          errorNotification: {
            message: 'Error marking invoice as paid',
            type: 'error',
          },
        },
        {
          onSuccess: () => {
            console.log("Success callback triggered");
            
            // Add a small delay to allow the notification to appear first
            setTimeout(() => {
              console.log("Refreshing data after notification");
              
              // Multiple approaches to refresh data
              invalidate({
                resource: "invoice",
                invalidates: ["list", "detail"],
              });
              
              // Direct refetch
              refetch();
              
              // Force component refresh
              setRefreshKey(prev => prev + 1);
              
              // Force window reload as last resort
              window.location.reload();
            }, 500); // 500ms delay should be enough for notification to appear
          },
          onError: (error) => {
            console.error("Error marking invoice as paid:", error);
          }
        }
      );
      handleMenuClose();
    }
  };

  const handleShow = () => {
    if (actionRow?.id) {
      navigate(`/invoice/show/${actionRow.id}`);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (actionRow?.id) {
      deleteInvoice({
        resource: "invoice",
        id: actionRow.id,
      });
      handleMenuClose();
    }
  };

  // Handle email sending
  const handleOpenEmailDialog = (invoiceId: string) => {
    setSelectedInvoiceForEmail(invoiceId);
    setIsEmailDialogOpen(true);
  };
  
  const handleSendEmail = () => {
    if (selectedInvoiceForEmail) {
      sendEmail({
        url: '/invoice/action/send-email',
        method: 'post',
        values: {
          invoiceId: selectedInvoiceForEmail,
          message: emailMessage
        },
        successNotification: {
          message: 'Invoice email has been sent successfully',
          type: 'success',
        },
        errorNotification: {
          message: 'Error sending invoice email',
          type: 'error',
        },
      });
      setIsEmailDialogOpen(false);
      setEmailMessage('');
      setSelectedInvoiceForEmail(null);
    }
  };

  // Fetch related data for dropdowns
  const { data: companiesData, isLoading: companiesIsLoading } = useMany({
    resource: "company",
    ids: dataGridProps?.rows?.map((item: any) => item?.companyId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: clientsData, isLoading: clientsIsLoading } = useMany({
    resource: "clients",
    ids: dataGridProps?.rows?.map((item: any) => item?.clientId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: paymentMethodsData, isLoading: paymentMethodsIsLoading } = useMany({
    resource: "paymentMethod",
    ids: dataGridProps?.rows?.map((item: any) => item?.paymentMethodId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  // Create rows with sequential numbering
  const rowsWithNumbers = React.useMemo(() => {
    if (!dataGridProps.rows) return [];
    return dataGridProps.rows.map((row: InvoiceRowData, index: number) => ({
      ...row,
      no: index + 1, // Add incremental number starting from 1
    }));
  }, [dataGridProps.rows]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "no",
        headerName: "No",
        type: "number",
        minWidth: 50,
        align: "left",
        headerAlign: "left",
        sortable: false,
      },
      {
        field: "companyId",
        headerName: "Company",
        flex: 1,
        renderCell: function render({ value }) {
          if (companiesIsLoading) {
            return "Loading...";
          }
          return companiesData?.data?.find((item) => item.id === value)?.name;
        },
      },
      {
        field: "clientId",
        headerName: "Client",
        flex: 1,
        renderCell: function render({ value }) {
          if (clientsIsLoading) {
            return "Loading...";
          }
          return clientsData?.data?.find((item) => item.id === value)?.legalName;
        },
      },
      {
        field: "paymentMethodId",
        headerName: "Payment Method",
        flex: 1,
        renderCell: function render({ value }) {
          if (paymentMethodsIsLoading) {
            return "Loading...";
          }
          return paymentMethodsData?.data?.find((item) => item.id === value)?.methodName;
        },
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: function render({ value }) {
          let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
          switch (value) {
            case "PAID":
              color = "success";
              break;
            case "pending":
              color = "warning";
              break;
            case "canceled":
              color = "error";
              break;
            default:
              color = "default";
          }
          return <Chip color={color} label={value} />;
        },
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        headerAlign: "center",
        renderCell: function render({ value }) {
          return (
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
              <DateField value={value} format="LLL" />
            </div>
          );
        },
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        headerAlign: "center",
        renderCell: function render({ value }) {
          return (
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', height: '100%' }}>
              <DateField value={value} format="LLL" />
            </div>
          );
        },
      },
      {
        field: "subtotal",
        headerName: "Total Amount",
        flex: 1,
        renderCell: function render({ value }) {
          return `$${parseFloat(value).toFixed(2)}`;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "center",
        headerAlign: "center",
        minWidth: 120,
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <IconButton
              onClick={(e) => handleMenuClick(e, row)}
              size="small"
              aria-controls={open ? "actions-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          );
        },
      },
    ],
    [
      companiesData?.data,
      companiesIsLoading,
      clientsData?.data,
      clientsIsLoading,
      paymentMethodsData?.data,
      paymentMethodsIsLoading,
    ],
  );

  return (
    <List>
      {/* Filter Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterAltIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Filter Invoices</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Status"
                  value={filters.status || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('status', e.target.value || null)
                  }
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="month-filter-label">Month</InputLabel>
                <Select
                  labelId="month-filter-label"
                  label="Month"
                  value={filters.month || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('month', e.target.value || null)
                  }
                >
                  <MenuItem value="">All Months</MenuItem>
                  {months.map(month => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="payment-method-filter-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-filter-label"
                  label="Payment Method"
                  value={filters.paymentMethodId || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('paymentMethodId', e.target.value || null)
                  }
                  disabled={paymentMethodsIsLoading}
                >
                  <MenuItem value="">All Payment Methods</MenuItem>
                  {paymentMethodsData?.data?.map((method: any) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.methodName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="company-filter-label">Company</InputLabel>
                <Select
                  labelId="company-filter-label"
                  label="Company"
                  value={filters.companyId || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('companyId', e.target.value || null)
                  }
                  disabled={companiesIsLoading}
                >
                  <MenuItem value="">All Companies</MenuItem>
                  {companiesData?.data?.map((company: any) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="client-filter-label">Client</InputLabel>
                <Select
                  labelId="client-filter-label"
                  label="Client"
                  value={filters.clientId || ''}
                  onChange={(e: SelectChangeEvent) => 
                    handleFilterChange('clientId', e.target.value || null)
                  }
                  disabled={clientsIsLoading}
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clientsData?.data?.map((client: any) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.legalName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ minWidth: '120px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DataGrid
        {...dataGridProps}
        rows={rowsWithNumbers}
        columns={columns}
        autoHeight
      />

      {/* Separate menu component outside the renderCell function */}
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'actions-button',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShow}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (actionRow?.id) {
            handleOpenEmailDialog(actionRow.id);
            handleMenuClose();
          }
        }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePaid}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark As Paid</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Email Dialog */}
      <Dialog
        open={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        aria-labelledby="email-dialog-title"
        aria-describedby="email-dialog-description"
      >
        <DialogTitle id="email-dialog-title">Send Invoice via Email</DialogTitle>
        <DialogContent>
          <DialogContentText id="email-dialog-description">
            Enter your message below to send it with the invoice.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email-message"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmailDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            color="primary"
            disabled={isSendingEmail}
          >
            {isSendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
};