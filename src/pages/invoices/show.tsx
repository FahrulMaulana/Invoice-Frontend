import React, { useEffect } from "react";
import {
  Show,
  DateField,
} from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useParams } from "react-router-dom";

interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  customPrice: number;
  quantity: number;
  total: number;
  product: {
    id: string;
    name: string;
    description: string;
  };
}

export const InvoiceShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const { id } = useParams();
  
  // Setup Teams share button
  useEffect(() => {
    if (id) {
      // Clean up any existing scripts first
      const existingScript = document.getElementById("teams-launcher-script");
      if (existingScript) {
        existingScript.remove();
      }

      // Set up Teams share button
      const invoiceUrl = `${window.location.origin}/invoice/show/${id}`;
      const teamsShareDiv = document.getElementById('teams-share');
      
      if (teamsShareDiv) {
        teamsShareDiv.innerHTML = 
          `<div class="teams-share-button" 
                data-href="${invoiceUrl}" 
                data-msg-text="Here is your invoice!" 
                data-preview="true">
          </div>`;
      }
      
      // Load Microsoft Teams share script
      const script = document.createElement('script');
      script.id = "teams-launcher-script";
      script.src = 'https://teams.microsoft.com/share/launcher.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Store the invoice URL in a global variable for direct access
      window.invoiceUrlForTeams = invoiceUrl;
    }
  }, [id, record]);

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    switch (status) {
      case "PAID":
      case "paid":
        color = "success";
        break;
      case "UNPAID":
      case "pending":
        color = "warning";
        break;
      case "canceled":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip color={color} label={status} />;
  };

  return (
    <Show
      isLoading={isLoading}
      title={<Typography variant="h5">Invoice Details</Typography>}
    >
      <Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Box mt={1}>{record?.status && getStatusChip(record.status)}</Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Invoice Number</Typography>
                <Typography variant="body1">{record?.invoiceNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Company</Typography>
                <Typography variant="body1">
                  {record?.fromCompany?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Client</Typography>
                <Typography variant="body1">
                  {record?.toClient?.legalName || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Invoice Date</Typography>
                <Typography variant="body1">
                  {record?.date ? (
                    <DateField value={record.date} format="LL" />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Due Date</Typography>
                <Typography variant="body1">
                  {record?.dueDate ? (
                    <DateField value={record.dueDate} format="LL" />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Payment Information</Typography>
                <Typography variant="body1">
                  {record?.paymentMethod?.info || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record?.items && record.items.length > 0 ? (
                    record.items.map((item: InvoiceItem, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.product?.name || item.productId}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.customPrice.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          ${item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No products
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box mt={2} display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="subtitle1">
                Subtotal: ${record?.subtotal?.toFixed(2) || "0.00"}
              </Typography>
              <Divider sx={{ my: 1, width: "200px" }} />
              <Typography variant="h6">
                Total: ${record?.subtotal?.toFixed(2) || "0.00"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Share Invoice
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<ShareIcon />}
                onClick={() => {
                  // Simulate a click on the actual Teams share button
                  const teamsShareButton = document.querySelector('.teams-share-button');
                  if (teamsShareButton) {
                    // Microsoft's Teams button is actually rendered as an iframe
                    // We need to programmatically open the share dialog
                    const invoiceUrl = window.invoiceUrlForTeams || `${window.location.origin}/invoice/show/${id}`;
                    window.open(`https://teams.microsoft.com/share?url=${encodeURIComponent(invoiceUrl)}&msg=${encodeURIComponent("Here is your invoice!")}`, '_blank', 'width=700,height=600');
                  }
                }}
              >
                Share to Microsoft Teams
              </Button>
              <Box id="teams-share" sx={{ display: 'flex', alignItems: 'center' }}></Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Show>
  );
};

// Add TypeScript declaration for global window property
declare global {
  interface Window {
    invoiceUrlForTeams?: string;
  }
}