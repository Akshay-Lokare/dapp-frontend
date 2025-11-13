import { jwtDecode } from 'jwt-decode';

export const getToken = (): string | null => {
  return localStorage.getItem('jwtToken');
}

export const saveToken = (token: string) => {
  return localStorage.setItem('jwtToken', token);
}

export const removeToken = () => {
  return localStorage.removeItem('jwtToken');
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);

    if (!decoded.exp) return true;
    
    return decoded.exp * 1000 < Date.now();

  } catch (error) {
    return true;
  }
}

export const getUserFromToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}