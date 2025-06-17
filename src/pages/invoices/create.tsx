import React, { useState } from "react";
import { Create } from "@refinedev/mui";
import { useNotification, useList, useCreate } from "@refinedev/core";
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
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  quantity: number;
  customerPrice: number;
}

interface FormValues {
  companyId: string;
  clientId: string;
  paymentMethodId: string;
  invoiceDate: Date;
  dueDate: Date;
  notes?: string;
  products: Product[];
  status?: string;
  total?: number;
}

export const InvoiceCreate: React.FC = () => {
  const { open } = useNotification();
  const navigate = useNavigate();
  const { mutate } = useCreate();
  
  const [formValues, setFormValues] = useState<Partial<FormValues>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API using Refine's useList hook
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
  const companyOptions = companiesData?.data || [];
  const clientOptions = clientsData?.data || [];
  const paymentMethodOptions = paymentMethodsData?.data || [];
  const productOptions = productsData?.data || [];

  const handleAddProduct = () => {
    if (currentProduct && currentPrice) {
      const newProduct = {
        id: currentProduct,
        quantity: currentQuantity,
        customerPrice: Number(currentPrice),
      };
      
      setProducts([...products, newProduct]);
      
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
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.quantity * product.customerPrice);
    }, 0);
  };

  const getProductName = (id: string) => {
    const product = productOptions.find(
      (option) => option.id === id
    );
    return product?.name || id;
  };

  const handleInputChange = (name: keyof FormValues, value: string | Date | number | Product[]) => {
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
    if (products.length === 0) {
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
    
    const values = {
      ...formValues,
      products,
      status: "pending",
      total: calculateTotal(),
    };
    
    // Submit data to API using Refine's useCreate hook
    mutate(
      {
        resource: "invoice",
        values,
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Invoice created successfully",
          });
          navigate("/invoice"); // Redirect to invoice list
        },
        onError: (error) => {
          console.error("Error creating invoice:", error);
          setError("Failed to create invoice. Please try again.");
        },
      }
    );
  };

  return (
    <Create 
      saveButtonProps={{
        type: "submit",
        form: "invoice-create-form"
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

      <form id="invoice-create-form" onSubmit={handleSubmit}>
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
                {clientOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.legalName || option.name}
                  </MenuItem>
                ))}
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
                {paymentMethodOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.methodName || option.name}
                  </MenuItem>
                ))}
              </Select>
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
                      {productOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
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
                      {products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{getProductName(product.id)}</TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">${product.customerPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            ${(product.quantity * product.customerPrice).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {products.length === 0 && (
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

          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              rows={4}
              fullWidth
              value={formValues.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </Grid>
        </Grid>
      </form>
    </Create>
  );
};