import React, { useState } from "react";
import {
  useList,
  useCustomMutation,
  HttpError,
} from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DownloadIcon from "@mui/icons-material/Download";
import dayjs from "dayjs";
import { Create } from "@refinedev/mui";

export const DownloadTemplate: React.FC = () => {
  // State for form values
  const [formValues, setFormValues] = useState({
    companyId: "",
    productId: "",
    paymentMethodId: "",
    clientIds: [] as string[],
    creationDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default: 14 days from today
  });

  // State for loading
  const [loading, setLoading] = useState(false);

  // Fetch data for dropdowns
  const { data: companies, isLoading: companiesLoading } = useList({
    resource: "company",
  });

  const { data: products, isLoading: productsLoading } = useList({
    resource: "product",
  });

  const { data: paymentMethods, isLoading: paymentMethodsLoading } = useList({
    resource: "paymentMethod",
  });

  const { data: clients, isLoading: clientsLoading } = useList({
    resource: "clients",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormValues({
        ...formValues,
        [name]: date,
      });
    }
  };

  // Handle multi-select change for clients
  const handleClientChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setFormValues({
      ...formValues,
      clientIds: value,
    });
  };

  // Handle "Select All" clients
  const handleSelectAllClients = () => {
    if (clients?.data) {
      const allClientIds = clients.data.map((client: any) => client.id);
      setFormValues({
        ...formValues,
        clientIds: allClientIds,
      });
    }
  };

  // Handle form submission to download the template
  const handleDownloadTemplate = async () => {
    setLoading(true);

    try {
      // Create request body according to the specified DTO format
      const requestBody = {
        companyId: formValues.companyId,
        productId: formValues.productId,
        paymentMethodId: formValues.paymentMethodId,
        date: dayjs(formValues.creationDate).format("YYYY-MM-DD"),
        due_date: dayjs(formValues.dueDate).format("YYYY-MM-DD"),
        client: formValues.clientIds.map(id => ({ id }))
      };

      // Use fetch API with POST method and proper headers
      const response = await fetch('/api/invoiceGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refine-auth')}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'invoice-template.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      // Show success notification
      const event = new CustomEvent('refine:notification', {
        detail: {
          type: 'success',
          message: 'Template downloaded successfully',
        },
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error downloading template:', error);
      // Show error notification
      const event = new CustomEvent('refine:notification', {
        detail: {
          type: 'error',
          message: 'Error downloading template',
        },
      });
      document.dispatchEvent(event);
    } finally {
      setLoading(false);
    }
  };

  // Check if any required fields are missing
  const isFormValid = () => {
    return (
      formValues.companyId !== "" &&
      formValues.productId !== "" &&
      formValues.paymentMethodId !== "" &&
      formValues.clientIds.length > 0 &&
      formValues.creationDate instanceof Date &&
      formValues.dueDate instanceof Date
    );
  };

  return (
    <Create
      title="Download Invoice Template"
      resource="invoice-generator"
      goBack={false}
    >
      <Card>
        <CardContent>
          <Box component="form">
            <Typography variant="body1" mb={3}>
              Configure the template parameters below and click download to get an Excel template
              pre-filled with your selected values.
            </Typography>

            <Grid container spacing={3}>
              {/* Company Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formValues.companyId === ""}>
                  <InputLabel id="company-select-label">Company</InputLabel>
                  <Select
                    labelId="company-select-label"
                    id="companyId"
                    name="companyId"
                    value={formValues.companyId}
                    onChange={handleChange as any}
                    label="Company"
                    disabled={companiesLoading}
                  >
                    {companies?.data?.map((company: any) => (
                      <MenuItem key={company.id} value={company.name}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formValues.companyId === "" && (
                    <FormHelperText>Required</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Product Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formValues.productId === ""}>
                  <InputLabel id="product-select-label">Product</InputLabel>
                  <Select
                    labelId="product-select-label"
                    id="productId"
                    name="productId"
                    value={formValues.productId}
                    onChange={handleChange as any}
                    label="Product"
                    disabled={productsLoading}
                  >
                    {products?.data?.map((product: any) => (
                      <MenuItem key={product.id} value={product.name}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formValues.productId === "" && (
                    <FormHelperText>Required</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Payment Method Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formValues.paymentMethodId === ""}>
                  <InputLabel id="payment-method-select-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-select-label"
                    id="paymentMethodId"
                    name="paymentMethodId"
                    value={formValues.paymentMethodId}
                    onChange={handleChange as any}
                    label="Payment Method"
                    disabled={paymentMethodsLoading}
                  >
                    {paymentMethods?.data?.map((method: any) => (
                      <MenuItem key={method.id} value={method.methodName}>
                        {method.methodName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formValues.paymentMethodId === "" && (
                    <FormHelperText>Required</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Clients Multi-Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formValues.clientIds.length === 0}>
                  <InputLabel id="clients-select-label">Clients</InputLabel>
                  <Select
                    labelId="clients-select-label"
                    id="clientIds"
                    multiple
                    value={formValues.clientIds}
                    onChange={handleClientChange as any}
                    input={<OutlinedInput label="Clients" />}
                    disabled={clientsLoading}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((clientId) => {
                          const client = clients?.data?.find((c: any) => c.id === clientId);
                          return (
                            <Chip key={clientId} label={client?.legalName || clientId} />
                          );
                        })}
                      </Box>
                    )}
                  >
                    <MenuItem value="select-all" onClick={handleSelectAllClients}>
                      <em>Select All</em>
                    </MenuItem>
                    {clients?.data?.map((client: any) => (
                      <MenuItem key={client.id} value={client.legalName}>
                        {client.legalName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formValues.clientIds.length === 0 && (
                    <FormHelperText>Required</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Creation Date */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Creation Date"
                    value={formValues.creationDate}
                    onChange={(date) => handleDateChange("creationDate", date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Due Date */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={formValues.dueDate}
                    onChange={(date) => handleDateChange("dueDate", date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={handleDownloadTemplate}
                  disabled={loading || !isFormValid()}
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {loading ? "Generating Template..." : "Download Template"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Create>
  );
};