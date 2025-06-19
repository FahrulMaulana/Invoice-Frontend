import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";

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

export const PaymentMethodEdit = () => {
  const { id } = useParams();

  const { data } = useOne({
    resource: "paymentMethod",
    id: id as string,
  });

  const paymentMethod = data?.data;

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    defaultValues: {
      methodName: paymentMethod?.methodName || "",
      info: paymentMethod?.info || "",
    },
  });

  // Cast errors to our interface type
  const formErrors = errors as unknown as FormErrors;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
    </Edit>
  );
};