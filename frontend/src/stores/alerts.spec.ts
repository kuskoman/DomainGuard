import { setActivePinia, createPinia } from "pinia";
import { useAlertStore } from "@/stores/alerts";
import { AlertType } from "@/stores/alerts";
import { expect, describe, beforeEach, it, vi } from "vitest";

vi.useFakeTimers();

describe("Alert Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds an alert", () => {
    const store = useAlertStore();

    store.addAlert(AlertType.Success, "Test Success Message");

    expect(store.alerts).toHaveLength(1);
    expect(store.alerts[0]).toMatchObject({
      type: AlertType.Success,
      message: "Test Success Message",
    });
  });

  it("removes an alert after timeout", () => {
    const store = useAlertStore();

    store.addAlert(AlertType.Info, "Test Info Message");

    expect(store.alerts).toHaveLength(1);

    vi.advanceTimersByTime(10000);

    expect(store.alerts).toHaveLength(0);
  });

  it("removes an alert manually", () => {
    const store = useAlertStore();

    store.addAlert(AlertType.Warning, "Test Warning Message");
    const alertId = store.alerts[0].id;

    store.removeAlert(alertId);

    expect(store.alerts).toHaveLength(0);
  });
});
