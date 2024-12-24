/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/styles/settings.scss";
import { createVuetify } from "vuetify";

const myCustomGreenTheme = {
  dark: false,
  colors: {
    background: "#F1F8F6", // Soft greenish white
    surface: "#FFFFFF", // Clean white for cards and containers
    "surface-bright": "#FFFFFF", // Bright white for elevated surfaces
    "surface-light": "#EAF3ED", // Slightly muted surface color
    "surface-variant": "#C8D6D0", // Muted gray-green for variants
    "on-surface-variant": "#4F5D53", // Text on variant surfaces
    primary: "#43A047", // Vibrant green
    "primary-darken-1": "#2E7D32", // Darker green for primary actions
    secondary: "#8BC34A", // Lime green for secondary actions
    "secondary-darken-1": "#689F38", // Darker lime for emphasis
    error: "#D32F2F", // Red for errors
    info: "#1976D2", // Blue for information
    success: "#388E3C", // Dark green for success states
    warning: "#FFA000", // Amber for warnings
  },
  variables: {
    "border-color": "#C8D6D0", // Muted green for borders
    "border-opacity": 0.15,
    "high-emphasis-opacity": 0.9,
    "medium-emphasis-opacity": 0.65,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.06,
    "hover-opacity": 0.08,
    "focus-opacity": 0.12,
    "selected-opacity": 0.1,
    "activated-opacity": 0.14,
    "pressed-opacity": 0.14,
    "dragged-opacity": 0.1,
    "theme-kbd": "#2E7D32", // Green for keyboard hint backgrounds
    "theme-on-kbd": "#FFFFFF", // White text on keyboard hints
    "theme-code": "#F1F8F6", // Light greenish white for code blocks
    "theme-on-code": "#2E7D32", // Dark green text on code blocks
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomGreenTheme",
    themes: {
      myCustomGreenTheme,
    },
  },
});
