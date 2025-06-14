import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Box from "@mui/material/Box";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();

  return (
    <AppBar
      position={sticky ? "sticky" : "relative"}
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <HamburgerMenu />
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                cursor: "pointer",
              }}
            >
              <ReceiptIcon color="primary" />
              <Typography
                variant="h6"
                fontWeight="700"
                color="primary"
                display={{ xs: "none", sm: "block" }}
              >
                Invoice Manager
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor:
                  mode === "dark" ? "primary.light" : "primary.light",
                color: mode === "dark" ? "primary.main" : "primary.main",
                "&:hover": {
                  backgroundColor:
                    mode === "dark" ? "primary.light" : "primary.light",
                  opacity: 0.8,
                },
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 40,
                    height: 40,
                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
