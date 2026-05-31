import { createContext, useState, useContext, useEffect } from "react";
import Notif from "./notif_success";
import { createPortal } from "react-dom";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  const showNotif = (type, message) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 2500);
  };


  return (
    <NotificationContext.Provider value={{ showNotif }}>
      {children}
      {notif &&
        createPortal(
          <Notif
            type={notif.type}
            message={notif.message}
            onClose={() => setNotif(null)}
          />,
          document.body
        )
      }

    </NotificationContext.Provider>
  );
}

export function useNotif() {
  return useContext(NotificationContext);
}