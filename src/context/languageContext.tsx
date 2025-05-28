import React, { useState, createContext, ReactNode } from "react";

/*
interface LanguageContextType {
  multiLang: string;
  ChangeLanguage: (lang: string) => void;
}
  */
export type Lang = 'EN' | 'FI'; // ✅ defind the type for language

interface LanguageContextType {
  multiLang: Lang;
  ChangeLanguage: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [multiLang, setMultiLang] = useState<Lang>('FI');

  const ChangeLanguage = (lang: Lang) => {
    setMultiLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ multiLang, ChangeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
