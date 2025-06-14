import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React from "react";
import { Header } from "../header";

// Define the props interface based on what's needed
type ModernLayoutProps = {
  children: React.ReactNode;
  Sider?: React.FC<{ Title?: React.FC }>;
  Title?: React.FC<{ collapsed?: boolean }>;
  Footer?: React.FC;
};

export const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  Sider,
  Title,
  Footer,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {Sider && (
        <Sider
          Title={Title}
        />
      )}
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Header sticky={true} />
        <Box
          component="main"
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            flex: 1,
            overflow: "auto",
          }}
        >
          <Container maxWidth="xl" sx={{ height: "100%" }}>
            {children}
          </Container>
        </Box>
        {Footer && <Footer />}
      </Box>
    </Box>
  );
};