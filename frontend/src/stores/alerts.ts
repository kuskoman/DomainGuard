import { getTypedArray } from "@/utils/arrayUtils";
import { defineStore } from "pinia";

export enum AlertType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}
export type Alert = {
  id: number;
  type: AlertType;
  message: string;
};

let idCounter = 0;

const SECOND = 1000;
const ALERT_TIMEOUT = 10 * SECOND;

export const useAlertStore = defineStore("alerts", {
  state: () => ({
    alerts: getTypedArray<Alert>(),
  }),
  actions: {
    addAlert(type: Alert["type"], message: string) {
      const id = idCounter++;
      this.alerts.push({ id, type, message });
      setTimeout(() => this.removeAlert(id), ALERT_TIMEOUT);
    },
    removeAlert(id: number) {
      this.alerts = this.alerts.filter((n) => n.id !== id);
    },
  },
});
