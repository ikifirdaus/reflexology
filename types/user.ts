import { Branch } from "@prisma/client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  branchId?: number | null;
  branch?: Branch | null;
};
