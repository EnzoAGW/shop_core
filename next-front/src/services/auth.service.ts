import api from '@/lib/api';
import type { LoginRequest, LoginResponse } from '@/models';

export const login = (req: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', req).then((r) => r.data);
