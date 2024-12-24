/**
 * plugins/vuetify.ts
 *
 * framework documentation: https://vuetifyjs.com
 */

// styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/styles/settings.scss";
import { createVuetify } from "vuetify";

const myCustomMUITheme = {
  dark: false,
  colors: {
    background: "#FFFFFF", // clean white background
    surface: "#F5F5F5", // light gray for cards and containers
    "surface-bright": "#FFFFFF", // bright white for elevated surfaces
    "surface-light": "#E0E0E0", // slightly darker gray for subtle surfaces
    "surface-variant": "#BDBDBD", // neutral gray for variants
    "on-surface-variant": "#424242", // text on variant surfaces
    primary: "#43A047", // vibrant green for navigation and primary actions
    "primary-darken-1": "#2E7D32", // darker green for emphasis
    secondary: "#FFB300", // amber for secondary actions and highlights
    "secondary-darken-1": "#FFA000", // darker amber
    error: "#E53935", // material design red for errors
    info: "#1E88E5", // material design blue for information
    success: "#43A047", // reusing green for success states
    warning: "#FB8C00", // orange for warnings
    caption: "#757575", // medium gray for captions and disabled text
  },
  variables: {
    "border-color": "#E0E0E0", // neutral gray for borders
    "border-opacity": 0.15,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.08,
    "focus-opacity": 0.12,
    "selected-opacity": 0.1,
    "activated-opacity": 0.14,
    "pressed-opacity": 0.14,
    "dragged-opacity": 0.1,
    "theme-kbd": "#424242", // dark gray for keyboard hint backgrounds
    "theme-on-kbd": "#FFFFFF", // white text on keyboard hints
    "theme-code": "#F5F5F5", // light gray for code blocks
    "theme-on-code": "#424242", // dark gray text on code blocks
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomMUITheme",
    themes: {
      myCustomMUITheme,
    },
  },
});
