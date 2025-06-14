import { useShow } from "@refinedev/core";
import {
  Show,
  TextFieldComponent as TextField,
  EmailField,
} from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";

export const CompanyShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Company Name
        </Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Email
        </Typography>
        <EmailField value={record?.email} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Address
        </Typography>
        <TextField value={record?.address} />
      </Stack>
    </Show>
  );
};