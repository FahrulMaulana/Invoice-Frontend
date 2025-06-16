import { Box, TextField, Button, Typography } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Define an interface for the form errors
interface FormErrors {
  name?: { message: string };
  email?: { message: string };
  address?: { message: string };
  file?: { message: string };
}

export const CompanyCreate = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    refineCoreProps: {
      action: "create",
      resource: "company",
      redirect: "list",
    },
  });

  // Cast errors to our interface type
  const formErrors = errors as unknown as FormErrors;

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

  // Handle file upload button click
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Custom form submit handler to handle file upload
  const onSubmit = async (data: any) => {
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("address", data.address);

    // Only append file if it exists
    if (data.file) {
      formData.append("file", data.file);
    }

    // Send to the server using the onFinish function
    await onFinish(formData);
  };

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(onSubmit),
      }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
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
        />

        {/* File Upload Field */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Company Logo (Optional)
          </Typography>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
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
            Upload Logo
          </Button>
          {fileName && (
            <Typography
              variant="body2"
              display="inline"
              color="textSecondary"
            >
              {fileName}
            </Typography>
          )}
        </Box>
      </Box>
    </Create>
  );
};