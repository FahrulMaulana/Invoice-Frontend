import { Box, TextField, Button, Typography } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useState, useRef, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

// Define an interface for the company DTO
interface CompanyDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  file?: string;
}

// Define an interface for the form errors
interface FormErrors {
  name?: { message: string };
  email?: { message: string };
  address?: { message: string };
  file?: { message: string };
}

// Helper function to format image URL
const formatImageUrl = (file?: string) => {

  const isProduction = import.meta.env.VITE_APP_ENV === 'local'

  const baseUrl = isProduction? 'http://localhost:3001': 'http://49.13.8.102:3001'

  return `${baseUrl}/${file}`;
};

export const CompanyEdit = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileChanged, setFileChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, onFinish },
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm<CompanyDTO>({
    refineCoreProps: {
      resource: "company",
      id: window.location.pathname.split("/").pop(),
      redirect: "list",
    },
  });

  // Cast errors to our interface type
  const formErrors = errors as unknown as FormErrors;

  const companyData = queryResult?.data?.data as CompanyDTO;

  // Set file name if company already has a logo
  useEffect(() => {
    if (companyData?.file) {
      // Extract file name from path if needed
      const logoName = companyData.file.split('/').pop() || 'Current logo';
      setFileName(logoName);
    }
  }, [companyData]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file as any);
      setFileChanged(true);
    }
  };

  // Handle file upload button click
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Custom form submit handler to handle file upload
  const onSubmit = async (data: CompanyDTO) => {
    // Create FormData object for file upload
    const formData = new FormData();
    
    // Append all fields from the form
    formData.append("id", data.id || companyData?.id || "");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("address", data.address);
    
    // Get the file from the form
    const fileField = fileInputRef.current?.files?.[0] || (fileChanged ? data.file : null);
    
    // Only append file if it exists and has changed
    if (fileField && fileChanged) {
      formData.append("file", fileField);
    }

    // Send to the server using the onFinish function
    return onFinish(formData);
  };
  
  // Get formatted image URL
  const imageUrl = formatImageUrl(companyData?.file);
  
  return (
    <Edit 
      isLoading={formLoading} 
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit)
      }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        {/* Hidden ID field */}
        <input 
          type="hidden" 
          {...register("id")} 
          defaultValue={companyData?.id} 
        />
        
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!formErrors?.name}
          helperText={formErrors?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Company Name"}
          name="name"
          defaultValue={companyData?.name}
        />
        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={!!formErrors?.email}
          helperText={formErrors?.email?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="email"
          label={"Email"}
          name="email"
          defaultValue={companyData?.email}
        />
        <TextField
          {...register("address", {
            required: "This field is required",
          })}
          error={!!formErrors?.address}
          helperText={formErrors?.address?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          label={"Address"}
          name="address"
          defaultValue={companyData?.address}
        />

        {/* File Upload Field */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Company Logo (Optional)
          </Typography>
          
          {companyData?.file && !fileChanged && !imgError && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Current logo: {fileName}
              </Typography>
              <Box
                component="img"
                src={imageUrl}
                alt="Current company logo"
                onError={(e) => {
                  console.error("Image loading error:", e);
                  setImgError(true);
                }}
                sx={{ 
                  maxWidth: '100px', 
                  maxHeight: '60px',
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}
              />
            </Box>
          )}
          
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            onClick={handleFileUploadClick}
            sx={{ mr: 2 }}
          >
            {companyData?.file ? 'Change Logo' : 'Upload Logo'}
          </Button>
          {fileChanged && fileName && (
            <Typography variant="body2" display="inline" color="textSecondary">
              New logo: {fileName}
            </Typography>
          )}
        </Box>
      </Box>
    </Edit>
  );
};