const db = require("../db/db");

module.exports = {
    dropdoor
}
async function dropdoor(){
    await db.RefreshToken.sync({ force: true });
    await db.Account.sync({ force: true });
    // await db.Lg.sync({ force: true });
    // await db.State.sync({ force: true });
    // await db.Country.sync({ force: true });
    // await db.Insurance.sync({ force: true });
    // await db.Pfa.sync({ force: true });
    // await db.Hmo.sync({ force: true });
    // await db.Banks.sync({ force: true });
}
