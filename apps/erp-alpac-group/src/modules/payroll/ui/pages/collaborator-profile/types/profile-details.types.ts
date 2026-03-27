export type TabId = "personal" | "work";
export interface PersonalFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  phone: string;
  role: string;
}
