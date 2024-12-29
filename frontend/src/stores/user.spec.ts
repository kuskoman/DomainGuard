import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "@/stores/user";
import { useAlertStore, AlertType } from "@/stores/alerts";
import { apiClient } from "@/api/client";
import { vi, describe, beforeEach, it, expect } from "vitest";
import axios, { AxiosError } from "axios";

vi.mock("@/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("sets and clears the access token", () => {
    const store = useUserStore();

    store.setAccessToken("test-token");
    expect(store.accessToken).toBe("test-token");
    expect(localStorage.getItem("accessToken")).toBe("test-token");
    expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer test-token");

    store.logout();
    expect(store.accessToken).toBe("");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
  });

  it("fetches user details successfully", async () => {
    const store = useUserStore();
    const alertStore = useAlertStore();

    const mockResponse = {
      data: {
        email: "test@example.com",
        id: "1",
        firstName: "Test",
        lastName: "User",
      },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

    await store.fetchUserDetails();

    expect(store.userDetails).toEqual(mockResponse.data);
    expect(alertStore.alerts).toHaveLength(0);
  });

  it("handles 401 error and clears access token", async () => {
    const store = useUserStore();
    const alertStore = useAlertStore();

    const error = new AxiosError("Unauthorized", undefined, undefined, undefined, {
      status: 401,
    } as any);

    vi.mocked(apiClient.get).mockRejectedValueOnce(error);

    await store.fetchUserDetails();

    expect(store.accessToken).toBe("");
    expect(store.userDetails).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("userEmail")).toBeNull();
    expect(alertStore.alerts).toHaveLength(1);
    expect(alertStore.alerts[0]).toMatchObject({
      type: AlertType.Error,
      message: expect.stringContaining("Failed to fetch user details"),
    });
  });

  it("handles other errors and adds an alert", async () => {
    const store = useUserStore();
    const alertStore = useAlertStore();

    const error = new Error("Network Error");

    vi.mocked(apiClient.get).mockRejectedValueOnce(error);

    await store.fetchUserDetails();

    expect(alertStore.alerts).toHaveLength(1);
    expect(alertStore.alerts[0]).toMatchObject({
      type: AlertType.Error,
      message: "Failed to fetch user details: Network Error",
    });
  });
});
