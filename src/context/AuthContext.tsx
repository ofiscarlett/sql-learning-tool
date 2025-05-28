import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
interface AuthContextType {
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('studentName');
        if (storedUser) setUser(storedUser);
    }, []);

    const login = (username: string) => {
        
        localStorage.setItem('studentName', username);  
        setUser(username);// Store username in localStorage
    }

    const logout = () => {
        localStorage.removeItem('studentName'); // Clear username from localStorage
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
  };
