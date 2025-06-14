import { Box, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const ClientEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    formState: { errors },
  } = useForm({});

  const clientData = queryResult?.data?.data;

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("legalName", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.legalName}
          helperText={(errors as any)?.legalName?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Legal Name"}
          name="legalName"
          defaultValue={clientData?.legalName}
        />
        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={!!(errors as any)?.email}
          helperText={(errors as any)?.email?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="email"
          label={"Email"}
          name="email"
          defaultValue={clientData?.email}
        />
        <TextField
          {...register("address", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.address}
          helperText={(errors as any)?.address?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          label={"Address"}
          name="address"
          defaultValue={clientData?.address}
        />
        <TextField
          {...register("netTerms", {
            required: "This field is required",
            valueAsNumber: true,
            validate: {
              positive: (value) => value >= 0 || "Net terms must be a positive number",
            },
          })}
          error={!!(errors as any)?.netTerms}
          helperText={(errors as any)?.netTerms?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label={"Net Terms (days)"}
          name="netTerms"
          defaultValue={clientData?.netTerms}
        />
      </Box>
    </Edit>
  );
};