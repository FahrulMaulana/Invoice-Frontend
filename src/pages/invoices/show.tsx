import React, { useEffect, useState } from "react";
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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Handle PDF export
  const handleExportPdf = () => {
    if (id) {
      setIsGeneratingPdf(true);
      
      // Create a direct fetch request to the API endpoint
      fetch(`/api/invoice/generate-pdf/${id}`, {
        method: 'PATCH', // The controller uses PATCH, not GET
        headers: {
          'Accept': 'application/pdf',
          // Include authorization token if needed
          'Authorization': `Bearer ${localStorage.getItem('refine-auth')}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('PDF generation failed');
          }
          return response.blob();
        })
        .then(blob => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a link element to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = `Invoice-${record?.invoiceNumber || id}.pdf`;
          
          // Append to the document, click it, and then remove it
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          setIsGeneratingPdf(false);
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
          setIsGeneratingPdf(false);
        });
    }
  };

  // Log data untuk debugging
  useEffect(() => {
  }, [record]);

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
                <Typography variant="subtitle2">Payment Method</Typography>
                <Typography variant="body1">
                  {record?.paymentMethod?.methodName || "N/A"}
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

        <Card sx={{ mb: 2 }}>
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

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Export Invoice
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? <CircularProgress size={24} /> : "Download PDF"}
            </Button>
          </CardContent>
        </Card>
      </Box>
      
      {/* PDF Generation Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={isGeneratingPdf}
      >
        <CircularProgress color="secondary" />
        <Typography variant="h6">Generating PDF...</Typography>
      </Backdrop>
    </Show>
  );
};

// Add TypeScript declaration for global window property
declare global {
  interface Window {
    invoiceUrlForTeams?: string;
  }
}