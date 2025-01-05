import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "@/stores/user";
import { apiClient } from "@/api/client";
import { vi, describe, beforeEach, it, expect } from "vitest";

const mockNotificationStore = {
  connectWebSocket: vi.fn(),
  disconnectWebSocket: vi.fn(),
};

vi.mock("@/stores/notifications", () => ({
  useNotificationStore: () => mockNotificationStore,
}));

vi.mock("@/api/client", () => ({
  apiClient: {
    defaults: { headers: { common: {} } },
  },
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.resetAllMocks();
  });

  it("sets access token and connects WebSocket", () => {
    const store = useUserStore();

    store.setAccessToken("test-token");

    expect(store.accessToken).toBe("test-token");
    expect(localStorage.getItem("accessToken")).toBe("test-token");
    expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer test-token");
    expect(mockNotificationStore.connectWebSocket).toHaveBeenCalledWith("test-token");
  });

  it("clears access token and disconnects WebSocket", () => {
    const store = useUserStore();

    store.setAccessToken("test-token");
    store.logout();

    expect(store.accessToken).toBe("");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
    expect(mockNotificationStore.disconnectWebSocket).toHaveBeenCalledTimes(1);
  });
});
