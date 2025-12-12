
const fs = require("fs");

const staff = [];

for (let i = 1; i <= 20000; i++) {
    staff.push({
        id: i,
        name: "User " + i,
        email: `user${i}@mail.com`,
        phone: "380" + (100000000 + i)
    });
}

fs.writeFileSync("db.json", JSON.stringify({ staff }, null, 2));
console.log("OK: 20000 записей создано");
