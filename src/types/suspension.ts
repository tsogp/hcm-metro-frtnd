export interface Suspension {
  id: string;
  metroLineID: string;
  title: string;
  description: string;
  suspensionType: "EMERGENCY" | "MAINTENANCE";
  expectedRestoreTime: string;
}
