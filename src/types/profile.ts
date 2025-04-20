export type UserProfileType = {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  nationalId: string;
  studentId: string | null;
  disabilityStatus: boolean;
  revolutionaryContribution: boolean;
  balance: number;
  profilePicture: string | null;
};

export type ProfileFormType = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  studentId: string;
  disabilityStatus: boolean;
  revolutionaryContribution: boolean;
};
