// src/state/auth.ts
type User = { email: string };
let currentUser: User | null = null;

export function login(user: User) {
  currentUser = user;
}
export function logout() {
  currentUser = null;
}
export function getCurrentUser() {
  return currentUser;
}
