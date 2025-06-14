import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

// Define an interface for the form errors
interface FormErrors {
  name?: { message: string };
  email?: { message: string };
  address?: { message: string };
}

export const CompanyEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    formState: { errors },
  } = useForm({});

  // Cast errors to our interface type
  const formErrors = errors as unknown as FormErrors;

  const companyData = queryResult?.data?.data;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
      </Box>
    </Edit>
  );
};