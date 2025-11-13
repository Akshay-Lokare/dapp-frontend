import React, { useState, useEffect, createContext } from 'react';
import { getToken, isTokenExpired, removeToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
 
// Automatically decodes the JWT from localStorage if it exists.
// Saves the user info globally in user.
// Removes token + resets user if expired.

export const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    
    if (token && !isTokenExpired(token)) {
        const decoded: any = jwtDecode(token);
        setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        });
    } else {
        removeToken();
        setUser(null);
    }

  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
        { children }
    </UserContext.Provider>
  )
}
