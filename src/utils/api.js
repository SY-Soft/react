export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8800${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    // если JWT истёк или невалиден
    if (res.status === 401) {
        localStorage.removeItem("token");
        throw {
            type: "AUTH",
            message: "Сессия истекла. Войдите снова.",
        };
    }

    // читаем текст ОДИН раз
    const text = await res.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw {
            type: "SERVER",
            message: "Сервер вернул некорректный ответ",
        };
    }

    if (!res.ok) {
        throw {
            type: "API",
            message: data.error || "Ошибка сервера",
        };
    }

    return data;
}
