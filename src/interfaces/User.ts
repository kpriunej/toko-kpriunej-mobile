export default interface User {
  id: number;
  name: string;
  email: string;
  sso_id: string;
  email_verified_at: string | null;
  is_active: boolean;
  member_id: string | null;
  group_id: number;
  unit_kerja_id: number | null;
  no_hp: string | null;
  noinduk: string | null;
  jabatan: string | null;
  pangkat: string | null;
  golongan: string | null;
  last_login_at: string;
  last_activity_at: string | null;
  last_login_ip: string;
  last_login_device: string | null;
  user_agent: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  is_verified: boolean;
  role: string;
}