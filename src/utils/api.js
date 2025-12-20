export async function apiFetch(url, options = {}) {
    const res = await fetch(`http://localhost:8800${url}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        ...options,
    });

    const data = await res.json();
    console.log(data);
    if (!data.success) {
        if (data.type === "AUTH") {
            throw { type: "AUTH", message: data.message };
        }

        if (data.errors) {
            throw { type: "VALIDATION", errors: data.errors };
        }

        throw { type: "BUSINESS", message: data.message };
    }
// console.log(res);
// console.log(data);

    return data.data;
}
