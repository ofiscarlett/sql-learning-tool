import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
interface AuthContextType {
    user: string | null;
    studentId: string | null; // Add studentId to the context
    login: (id: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<string | null>(null);
    const [studentId, setStudentId] = useState<string | null>(null);


    useEffect(() => {
        const id = localStorage.getItem('studentId');
        const storedUser = localStorage.getItem('studentName');
        if (id) setStudentId(id);
        if (storedUser) setUser(storedUser);
    }, []);

    const login = (id:string, username: string) => {
        localStorage.setItem('studentId', id);
        localStorage.setItem('studentName', username); 
        setStudentId(id); 
        setUser(username);// Store username in localStorage
    }

    const logout = () => {
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentName'); // Clear username from localStorage
        setStudentId(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{studentId, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
  };
