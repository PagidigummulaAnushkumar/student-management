export type Student = {
  id?: number; // adjust if your backend uses UUID/string
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
};
