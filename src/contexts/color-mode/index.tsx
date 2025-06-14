import { ThemeProvider } from "@mui/material/styles";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { PaletteMode } from "@mui/material";
import { createCustomTheme } from "../theme";

type ColorModeContextType = {
  mode: PaletteMode;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState<PaletteMode>(
    (colorModeFromLocalStorage as PaletteMode) || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  // Create custom theme based on current mode
  const theme = createCustomTheme(mode);

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
