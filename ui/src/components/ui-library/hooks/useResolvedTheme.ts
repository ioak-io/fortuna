import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useResolvedTheme() {
  const { theme, systemTheme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(systemTheme === "dark" ? "dark" : "light");
    } else {
      setResolvedTheme(theme as "light" | "dark");
    }
  }, [theme, systemTheme]);

  return resolvedTheme;
}
