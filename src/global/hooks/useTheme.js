import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";
const LEGACY_THEME_STORAGE_KEY = "fasecerta-theme";
const DEFAULT_THEME = "light";

const isValidTheme = (theme) => theme === "light" || theme === "dark";

const applyThemeOnDom = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);
};

export const getTheme = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isValidTheme(storedTheme)) {
    applyThemeOnDom(storedTheme);
    return storedTheme;
  }

  const legacyTheme = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  if (isValidTheme(legacyTheme)) {
    window.localStorage.setItem(THEME_STORAGE_KEY, legacyTheme);
    applyThemeOnDom(legacyTheme);
    return legacyTheme;
  }

  applyThemeOnDom(DEFAULT_THEME);
  return DEFAULT_THEME;
};

export const setTheme = (theme) => {
  const safeTheme = isValidTheme(theme) ? theme : DEFAULT_THEME;

  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
  }

  applyThemeOnDom(safeTheme);
  return safeTheme;
};

export const toggleTheme = () => {
  const currentTheme = getTheme();
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  return setTheme(nextTheme);
};

const useTheme = () => {
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const updateTheme = useCallback((nextTheme) => {
    const appliedTheme = setTheme(nextTheme);
    setThemeState(appliedTheme);
  }, []);

  const handleToggleTheme = useCallback(() => {
    const nextTheme = toggleTheme();
    setThemeState(nextTheme);
  }, []);

  return {
    theme,
    getTheme,
    setTheme: updateTheme,
    toggleTheme: handleToggleTheme,
  };
};

export default useTheme;
