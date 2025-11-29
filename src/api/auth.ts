// src/api/auth.ts
export type SignUpRequest = { email: string; password: string };
export type SignUpResponse = { token: string; user: { id: string; email: string } };

export async function signUp(payload: SignUpRequest): Promise<SignUpResponse> {
  await new Promise((r) => setTimeout(r, 700));
  if (!payload.email.includes('@')) throw { message: 'Invalid email' };
  if (payload.password.length < 6) throw { message: 'Password too short' };
  return { token: 'mock-token-123', user: { id: 'u_1', email: payload.email } };
}

export async function loginRequest(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (!email) throw { message: 'Missing email' };
  return { token: 'mock-token-123', user: { id: 'u_1', email } };
}
