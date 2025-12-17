export async function apiFetch(url, options = {}) {
    const res = await fetch(`http://localhost:8800${url}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(options.headers || {}),
        },
        ...options,
    });

    // AUTH
    if (res.status === 401 || res.status === 403) {
        throw { type: "AUTH", message: "Unauthorized" };
    }

    // SERVER
    if (!res.ok) {
        throw { type: "SERVER", message: "Ошибка сервера" };
    }

    const data = await res.json();

    // 💥 ВОТ ОНО
    if (data.success === false) {
        throw {
            type: "BUSINESS",
            errors: data.errors || {},
            message: "Ошибка валидации",
        };
    }

    return data;
}
