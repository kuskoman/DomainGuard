import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { AlertType, useAlertStore } from "@/stores/alerts";
import AlertsBar from "./AlertsBar.vue";
import { setupVuetify } from "@/utils/testUtils";

describe("AlertsBar.vue", () => {
  it("renders alerts from the store", () => {
    const wrapper = mount(AlertsBar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), setupVuetify()],
      },
    });

    const alertStore = useAlertStore();
    alertStore.addAlert(AlertType.Success, "Test Alert 1");
    alertStore.addAlert(AlertType.Error, "Test Alert 2");

    expect(wrapper.findAll(".v-alert").length).toBe(2);
    expect(wrapper.text()).toContain("Test Alert 1");
    expect(wrapper.text()).toContain("Test Alert 2");
  });

  it("removes an alert when the close button is clicked", async () => {
    const wrapper = mount(AlertsBar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });

    const alertStore = useAlertStore();
    alertStore.addAlert(AlertType.Info, "Test Alert to Close");

    expect(wrapper.findAll(".v-alert").length).toBe(1);

    const closeButton = wrapper.find(".v-btn");
    await closeButton.trigger("click");

    expect(alertStore.removeAlert).toHaveBeenCalledTimes(1);
    const firstAlertId = 0;
    expect(alertStore.removeAlert).toHaveBeenCalledWith(firstAlertId);
  });
});
