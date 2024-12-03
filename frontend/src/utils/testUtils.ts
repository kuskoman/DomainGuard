import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

/** setupVuetify is a function with a side effect that sets up Vuetify for testing
 * and ensures that ResizeObserver is available in the global scope.
 * @returns {Vuetify} A Vuetify instance
 */
export const setupVuetify = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.ResizeObserver = require("resize-observer-polyfill");

  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "dark",
    },
  });

  return vuetify;
};
