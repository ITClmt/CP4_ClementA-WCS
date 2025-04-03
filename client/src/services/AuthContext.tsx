import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthProps {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const authContext = createContext<AuthProps | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(
      localStorage.getItem("CP4user") ||
        JSON.stringify({
          id: 0,
          email: "",
          firstName: "",
          lastName: "",
          isAdmin: false,
        }),
    ),
  );
  useEffect(() => {
    if (currentUser.id !== 0) {
      localStorage.setItem("CP4user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <authContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </authContext.Provider>
  );
}

export default function Auth() {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("Le auth context doit exister");
  }
  return context;
}
