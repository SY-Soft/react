import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [message, setMessage] = useState(null);

    function notify(text, type = "info") {
        setMessage({ text, type });

        // авто-скрытие через 3 сек
        setTimeout(() => setMessage(null), 7000);
    }

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            {message && (
                <div className={`alert alert-${message.type} position-fixed top-0 end-0 m-3`}>
                    {message.text}
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export function useNotify() {
    return useContext(NotificationContext);
}
