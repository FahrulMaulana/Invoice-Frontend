import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Define custom colors
const getThemeColors = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: {
            main: "#3d5af1",
            light: "#e1e5fa",
            dark: "#2a3da3",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#22b8cf",
            light: "#e3f2fd",
            dark: "#0e7490",
            contrastText: "#ffffff",
          },
          background: {
            default: "#F6F5F5",
            paper: "#ffffff",
          },
          text: {
            primary: "#334155",
            secondary: "#64748b",
          },
          divider: "rgba(0, 0, 0, 0.06)",
        }
      : {
          // Dark mode colors
          primary: {
            main: "#4f6bff",
            light: "#303e80",
            dark: "#2342cb",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#38bfd8",
            light: "#134e57",
            dark: "#0e7490",
            contrastText: "#ffffff",
          },
          background: {
            default: "#0f172a",
            paper: "#1e293b",
          },
          text: {
            primary: "#f1f5f9",
            secondary: "#94a3b8",
          },
          divider: "rgba(255, 255, 255, 0.06)",
        }),
  },
});

// Define custom typography
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: "2.5rem",
  },
  h2: {
    fontWeight: 600,
    fontSize: "2rem",
  },
  h3: {
    fontWeight: 600,
    fontSize: "1.75rem",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.25rem",
  },
  h6: {
    fontWeight: 600,
    fontSize: "1rem",
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: "1rem",
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  body1: {
    fontSize: "1rem",
  },
  body2: {
    fontSize: "0.875rem",
  },
  button: {
    fontWeight: 600,
    textTransform: "none",
  },
};

// Define custom shape (border radius)
const shape = {
  borderRadius: 8,
};

// Define custom component overrides
const getComponentOverrides = (mode: PaletteMode) => ({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === "light" 
            ? "0px 2px 4px rgba(0, 0, 0, 0.05)" 
            : "0px 2px 4px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          "&:last-child": {
            paddingBottom: "24px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          fontWeight: 600,
          textTransform: "none",
          padding: "8px 16px",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: mode === "light" ? "#2342cb" : "#3d5af1",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
          padding: "12px 16px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === "light" ? "#f8fafc" : "#1e293b",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "light" ? "#ffffff" : "#1e293b",
          boxShadow: mode === "light" 
            ? "0px 1px 2px rgba(0, 0, 0, 0.05)" 
            : "0px 1px 2px rgba(0, 0, 0, 0.2)",
          color: mode === "light" ? "#334155" : "#f1f5f9",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 8,
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        },
        columnHeaders: {
          backgroundColor: mode === "light" ? "#f8fafc" : "#1e293b",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      },
    },
  },
});

// Create theme function
export const createCustomTheme = (mode: PaletteMode) => {
  return createTheme({
    ...getThemeColors(mode),
    typography,
    shape,
    ...getComponentOverrides(mode),
  });
};