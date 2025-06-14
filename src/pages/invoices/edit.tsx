import React, { useState, useEffect } from "react";
import { Edit } from "@refinedev/mui";
import { useNotification, useList, BaseRecord, useOne, useUpdate } from "@refinedev/core";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";

interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  productId: string;
  customPrice: number;
  quantity: number;
  total?: number;
  product?: {
    id: string;
    name: string;
    description: string;
  };
}

interface Company extends BaseRecord {
  id: string;
  name: string;
}

interface Client extends BaseRecord {
  id: string;
  legalName: string;
}

interface PaymentMethod extends BaseRecord {
  id: string;
  methodName: string;
}

interface ProductOption extends BaseRecord {
  id: string;
  name: string;
}

interface FormValues {
  companyId: string;
  clientId: string;
  paymentMethodId: string;
  date: string;
  dueDate: string;
  notes?: string;
  items?: InvoiceItem[];
  status?: string;
  subtotal?: number;
}

export const InvoiceEdit: React.FC = () => {
  const { open } = useNotification();
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate } = useUpdate();
  
  const [formValues, setFormValues] = useState<Partial<FormValues>>({});
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch invoice data
  const { data: invoiceData, isLoading: isLoadingInvoice } = useOne({
    resource: "invoice",
    id: id as string,
  });

  // Log data untuk debugging
  useEffect(() => {
    console.log("Invoice data:", invoiceData?.data);
    console.log("Invoice items:", invoiceData?.data?.items);
  }, [invoiceData]);

  // Fetch related data
  const { data: companiesData, isLoading: isLoadingCompanies } = useList({
    resource: "company",
  });
  
  const { data: clientsData, isLoading: isLoadingClients } = useList({
    resource: "clients",
  });
  
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useList({
    resource: "paymentMethod",
  });
  
  const { data: productsData, isLoading: isLoadingProducts } = useList({
    resource: "product",
  });

  // Extract options from API data with proper type casting
  const companyOptions = companiesData?.data as Company[] || [];
  const clientOptions = clientsData?.data as Client[] || [];
  const paymentMethodOptions = paymentMethodsData?.data as PaymentMethod[] || [];
  const productOptions = productsData?.data as ProductOption[] || [];

  // Initialize form with invoice data
  useEffect(() => {
    if (invoiceData?.data) {
      const invoice = invoiceData.data;
      
      setFormValues({
        companyId: invoice.companyId,
        clientId: invoice.clientId,
        paymentMethodId: invoice.paymentMethodId,
        date: invoice.date 
          ? new Date(invoice.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate 
          ? new Date(invoice.dueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: invoice.status,
      });
      
      if (invoice.items && Array.isArray(invoice.items)) {
        setItems(invoice.items);
      }
    }
  }, [invoiceData]);

  const handleAddProduct = () => {
    if (currentProduct && currentPrice) {
      const newItem: InvoiceItem = {
        productId: currentProduct,
        quantity: currentQuantity,
        customPrice: Number(currentPrice),
        total: currentQuantity * Number(currentPrice)
      };
      
      // Tambahkan informasi produk jika tersedia
      const productInfo = productOptions.find(p => p.id === currentProduct);
      if (productInfo) {
        newItem.product = {
          id: productInfo.id,
          name: productInfo.name,
          description: productInfo.description || ""
        };
      }
      
      setItems([...items, newItem]);
      
      // Clear current product form fields
      setCurrentProduct("");
      setCurrentQuantity(1);
      setCurrentPrice("");
    } else {
      open?.({
        type: "error",
        message: "Please select a product, quantity, and price",
      });
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.customPrice);
    }, 0);
  };

  const getProductName = (productId: string) => {
    const product = productOptions.find(
      (option) => option.id === productId
    );
    return product?.name || productId;
  };

  const handleInputChange = (name: keyof FormValues, value: string | number | InvoiceItem[]) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formValues.companyId) {
      setError("Please select a company");
      return false;
    }
    if (!formValues.clientId) {
      setError("Please select a client");
      return false;
    }
    if (!formValues.paymentMethodId) {
      setError("Please select a payment method");
      return false;
    }
    if (!formValues.date) {
      setError("Please select an invoice date");
      return false;
    }
    if (!formValues.dueDate) {
      setError("Please select a due date");
      return false;
    }
    if (items.length === 0) {
      setError("Please add at least one product");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert dates from string to Date if needed
    const processedFormValues = {
      ...formValues,
      date: formValues.date ? new Date(formValues.date) : new Date(),
      dueDate: formValues.dueDate ? new Date(formValues.dueDate) : new Date(),
    };
    
    // Calculate subtotal
    const subtotal = calculateTotal();
    
    const values = {
      ...processedFormValues,
      items: items.map(item => ({
        productId: item.productId,
        customPrice: item.customPrice,
        quantity: item.quantity,
        total: item.quantity * item.customPrice,
        ...(item.id ? { id: item.id } : {})
      })),
      subtotal,
    };
    
    console.log("Form submitted:", values);
    
    // Submit data to API using Refine's useUpdate hook
    mutate(
      {
        resource: "invoice",
        id: id as string,
        values,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Invoice updated successfully",
          });
          navigate("/invoice"); // Redirect to invoice list
        },
        onError: (error) => {
          console.error("Error updating invoice:", error);
          setError("Failed to update invoice. Please try again.");
        },
      }
    );
  };

  const isLoading = isLoadingInvoice || isLoadingCompanies || isLoadingClients || isLoadingPaymentMethods || isLoadingProducts;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Edit 
      saveButtonProps={{
        type: "submit",
        form: "invoice-edit-form"
      }}
    >
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      <form id="invoice-edit-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="company-label">Company</InputLabel>
              <Select
                labelId="company-label"
                label="Company"
                required
                value={formValues.companyId || ""}
                onChange={(e) => handleInputChange("companyId", e.target.value)}
              >
                {companyOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="client-label">Client</InputLabel>
              <Select
                labelId="client-label"
                label="Client"
                required
                value={formValues.clientId || ""}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
              >
                {clientOptions.length > 0 ? (
                  clientOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.legalName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No clients available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                label="Payment Method"
                required
                value={formValues.paymentMethodId || ""}
                onChange={(e) => handleInputChange("paymentMethodId", e.target.value)}
              >
                {paymentMethodOptions.length > 0 ? (
                  paymentMethodOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.methodName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No payment methods available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                required
                value={formValues.status || "UNPAID"}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <MenuItem value="UNPAID">Unpaid</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="CANCELED">Canceled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Invoice Date"
                type="date"
                required
                fullWidth
                value={formValues.date || ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  handleInputChange("date", e.target.value);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Due Date"
                type="date"
                required
                fullWidth
                value={formValues.dueDate || ""}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  handleInputChange("dueDate", e.target.value);
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ mt: 2, mb: 2 }}>
              <CardHeader title="Products" />
              <CardContent>
                <Box display="flex" gap={2} mb={2} alignItems="center">
                  <FormControl sx={{ flex: 2 }}>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Select
                      labelId="product-label"
                      label="Product"
                      value={currentProduct}
                      onChange={(e) => setCurrentProduct(e.target.value)}
                    >
                      {productOptions.length > 0 ? (
                        productOptions.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No products available</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Quantity"
                    type="number"
                    sx={{ flex: 1 }}
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />

                  <TextField
                    label="Price"
                    type="number"
                    sx={{ flex: 1 }}
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 },
                      startAdornment: <Typography variant="body2">$</Typography>,
                    }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                  >
                    Add
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product?.name || getProductName(item.productId)}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.customPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            ${(item.quantity * item.customPrice).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduct(index)}
                              sx={{ visibility: 'visible' }} // Ensure delete button is visible
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No products added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Typography variant="h6">
                    Total: ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Edit>
  );
};