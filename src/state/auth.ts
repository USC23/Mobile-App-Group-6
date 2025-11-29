// src/state/auth.ts
export type User = {
  email?: string;
  name?: string; // display name
};

let currentUser: User | null = null;

// simple subscribers list
type Listener = (user: User | null) => void;
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) {
    try {
      l(currentUser);
    } catch (e) {
      // ignore listener errors
    }
  }
}

export function login(user: User) {
  currentUser = { ...user };
  notify();
}

export function setCurrentUser(user: Partial<User>) {
  currentUser = { ...(currentUser ?? {}), ...user };
  notify();
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function logout() {
  currentUser = null;
  notify();
}

// subscription API
export function subscribeAuth(listener: Listener) {
  listeners.add(listener);
  // return unsubscribe that returns void (not boolean)
  return () => {
    listeners.delete(listener);
  };
}
