const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
    const res = await fetch(`${API_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        ...options,
    });

    const data = await res.json();
    if (!data.success) {
        if (data.type === "AUTH") {
            throw { type: "AUTH", message: data.message };
        }

        if (data.errors) {
            throw { type: "VALIDATION", errors: data.errors };
        }

        throw { type: "BUSINESS", message: data.message };
    }
    return data.data;
}
