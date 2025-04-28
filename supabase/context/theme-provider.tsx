"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Set default theme to dark if not specified
  const defaultProps = {
    defaultTheme: "dark",
    ...props
  }
  
  return <NextThemesProvider {...defaultProps}>{children}</NextThemesProvider>
}
