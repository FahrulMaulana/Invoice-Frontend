import { useShow, useOne } from "@refinedev/core";
import {
  Show,
  TextFieldComponent as TextField,
  NumberField,
  EmailField,
} from "@refinedev/mui";
import { Typography, Stack, Box } from "@mui/material";

export const ClientShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Legal Name
        </Typography>
        <TextField value={record?.legalName} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Email
        </Typography>
        <EmailField value={record?.email} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Address
        </Typography>
        <TextField value={record?.address} />

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
          Net Terms (days)
        </Typography>
        <NumberField value={record?.netTerms ?? 0} />
      </Stack>
    </Show>
  );
};