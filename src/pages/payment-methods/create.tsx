import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

// Define an interface for the form errors
interface FormErrors {
  methodName?: { message: string };
  info?: { message: string };
}

// Define the payment method interface
interface PaymentMethodFormValues {
  methodName: string;
  info: string;
}

export const PaymentMethodCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    defaultValues: {
      methodName: "",
      info: "",
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
          {...register("methodName", {
            required: "Payment method name is required",
          })}
          error={!!formErrors?.methodName}
          helperText={formErrors?.methodName?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Payment Method Name"
          name="methodName"
        />
        <TextField
          {...register("info", {
            required: "Information is required",
          })}
          error={!!formErrors?.info}
          helperText={formErrors?.info?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          label="Information"
          name="info"
        />
      </Box>
    </Create>
  );
};