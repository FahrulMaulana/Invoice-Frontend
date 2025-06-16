import { useShow } from "@refinedev/core";
import {
  Show,
  TextFieldComponent as TextField,
  EmailField,
} from "@refinedev/mui";
import { Typography, Stack, Box, Paper, Divider } from "@mui/material";
import { useState } from "react";

// Helper function to format image URL
const formatImageUrl = (file?: string) => {
  if (!file) return null;

  // If it's already a full URL, return it
  if (file.startsWith("http")) return file;

  // Check if file starts with a slash
  const formattedPath = file.startsWith("/") ? file.substring(1) : file;

  // Otherwise, prepend the base URL
  return `http://localhost:3001/${formattedPath}`;
};

export const CompanyShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const [imgError, setImgError] = useState(false);

  const record = data?.data;
  const imageUrl = formatImageUrl(record?.file);

  console.log("Company logo URL:", imageUrl); // For debugging

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        {/* Display company logo if available */}
        {record?.file && !imgError && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold">
              Company Logo
            </Typography>
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 2,
                border: "1px solid #eee",
                display: "inline-block",
              }}
            >
              <Box
                component="img"
                src={imageUrl}
                alt={`${record?.name} logo`}
                onError={(e) => {
                  console.error("Image loading error:", e);
                  setImgError(true);
                }}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "150px",
                }}
              />
            </Paper>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

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