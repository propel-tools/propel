/**
 * Application configuration
 */
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    useMockFallback: process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK === "true",
    timeout: 8000, // 8 seconds
  },
  features: {
    enableTeamManagement: true,
    enableMemberManagement: true,
    enableBadges: true,
    enableOnCall: true,
  },
  ui: {
    defaultTheme: "system", // 'light', 'dark', or 'system'
    enableThemeCustomization: true,
  },
}

