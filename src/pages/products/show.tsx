import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { Stack, TextField, Typography } from "@mui/material";

export const ProductShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Name
        </Typography>
        <TextField value={record?.name} variant="outlined" fullWidth disabled />

        <Typography variant="body1" fontWeight="bold">
          Description
        </Typography>
        <TextField
          value={record?.description}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          disabled
        />
      </Stack>
    </Show>
  );
};