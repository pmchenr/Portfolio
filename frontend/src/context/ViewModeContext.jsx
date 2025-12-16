import { createContext, useContext, useState } from 'react';

// Helper to get user info from stored token
function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

const ViewModeContext = createContext();

export function ViewModeProvider({ children }) {
  const [viewMode, setViewMode] = useState("admin"); // admin, subscriber, guest

  // Get actual user info
  const user = getUserFromToken();
  const actualIsAdmin = user?.role === "admin";

  // Computed values based on view mode (only admins can switch)
  const isAdmin = actualIsAdmin && viewMode === "admin";
  const isSubscriber = actualIsAdmin
    ? (viewMode === "admin" || viewMode === "subscriber")
    : (user?.isSubscriber || false);

  return (
    <ViewModeContext.Provider value={{
      viewMode,
      setViewMode,
      actualIsAdmin,
      isAdmin,
      isSubscriber,
      user
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
