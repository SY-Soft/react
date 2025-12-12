export async function getUsers() {
    const res = await fetch("http://localhost:8800/users");
    return res.json();
}
