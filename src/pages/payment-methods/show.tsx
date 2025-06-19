import { useShow } from "@refinedev/core";
import { Show, TextFieldComponent as TextField } from "@refinedev/mui";
import { Stack, Typography } from "@mui/material";

export const PaymentMethodShow = () => {
  const { queryResult } = useShow({
    resource: "paymentMethod",
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Payment Method Name
        </Typography>
        <TextField value={record?.methodName} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Information
        </Typography>
        <TextField value={record?.info} />
      </Stack>
    </Show>
  );
};