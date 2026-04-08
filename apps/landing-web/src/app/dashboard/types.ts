export type WaitlistRow = {
  id: string;
  email: string;
  created_at: string;
  source: string | null;
};

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  source: string | null;
};
