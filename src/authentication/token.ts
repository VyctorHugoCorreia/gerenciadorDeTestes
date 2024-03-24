export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}



export function getAcessProfile(): string | null {
  return localStorage.getItem('acessProfile');
}

export function setAcessProfile(profile: string): void {
  localStorage.setItem('acessProfile', profile);
}

export function getUsername(): string | null {
  return localStorage.getItem('username');
}

export function setUsername(name: string): void {
  localStorage.setItem('username', name);
}



