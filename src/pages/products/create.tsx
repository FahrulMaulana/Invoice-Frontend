import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

// Define an interface for the form errors
interface FormErrors {
  name?: { message: string };
  description?: { message: string };
}

// Define the product interface
interface ProductFormValues {
  name: string;
  description: string;
}

export const ProductCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Cast errors to our interface type
  const formErrors = errors as unknown as FormErrors;

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "Product name is required",
          })}
          error={!!formErrors?.name}
          helperText={formErrors?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Product Name"
          name="name"
        />
        <TextField
          {...register("description", {
            required: "Description is required",
          })}
          error={!!formErrors?.description}
          helperText={formErrors?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          label="Description"
          name="description"
        />
      </Box>
    </Create>
  );
};