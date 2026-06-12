import { createContext, useContext, useState } from 'react';

const VariantContext = createContext();

export const VariantProvider = ({ children }) => {
  const [customVariant, setCustomVariant] = useState(null);

  const handleCustomVariant = (variant) => {
    setCustomVariant(variant);
  };

  return (
    <VariantContext.Provider value={{ customVariant, handleCustomVariant }}>
      {children}
    </VariantContext.Provider>
  );
};

export const useVariant = () => {
  return useContext(VariantContext);
};