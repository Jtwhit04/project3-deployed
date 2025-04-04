import React, { createContext, useState } from 'react';

export const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};