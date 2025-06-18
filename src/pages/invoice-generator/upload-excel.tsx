import React, { useState } from "react";
import {
  useNotification,
  HttpError,
} from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArticleIcon from "@mui/icons-material/Article";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

// Styled component for drag & drop area
const UploadBox = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const UploadExcel: React.FC = () => {
  // State for selected file
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const { open } = useNotification();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  // Validate file type
  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      open?.({
        type: "error",
        message: "Only Excel files (.xlsx, .xls) are allowed",
      });
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) return;

    setIsSubmitting(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploadExcel', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refine-auth')}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: 'Invoices generated successfully',
          count: result.count || 0,
        });
        
        open?.({
          type: "success",
          message: `Successfully generated ${result.count || 0} invoices`,
        });
      } else {
        setUploadResult({
          success: false,
          message: result.message || 'Failed to process the Excel file',
        });
        
        open?.({
          type: "error",
          message: result.message || 'Failed to process the Excel file',
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      setUploadResult({
        success: false,
        message: 'An unexpected error occurred',
      });
      
      open?.({
        type: "error",
        message: 'An unexpected error occurred while processing the file',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Create
      title="Upload Excel Template"
      resource="invoice-generator"
      goBack={false}
    >
      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Upload the filled Excel template to generate invoices automatically. The system will process the file and create invoices based on the data.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Make sure you are using the template downloaded from the system. Don't modify the template structure.
            </Alert>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UploadBox
                elevation={0}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  borderColor: isDragging ? 'primary.dark' : 'primary.main',
                  backgroundColor: isDragging ? 'action.hover' : 'background.default',
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  type="file"
                  id="file-input"
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  {isDragging ? 'Drop your file here' : 'Drag & Drop your Excel file here'}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  or click to browse files
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('file-input')?.click();
                  }}
                >
                  Select File
                </Button>
              </UploadBox>
            </Grid>

            {file && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArticleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                disabled={!file || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Processing...' : 'Upload and Generate Invoices'}
              </Button>
            </Grid>

            {uploadResult && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Alert severity={uploadResult.success ? "success" : "error"}>
                  {uploadResult.message}
                </Alert>
                
                {uploadResult.success && uploadResult.count && (
                  <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Summary:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Successfully generated ${uploadResult.count} invoices`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="You can view and manage these invoices in the Invoices section"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Create>
  );
};