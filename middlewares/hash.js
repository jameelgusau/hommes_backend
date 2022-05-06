const bcrypt = require('bcryptjs');

module.exports = hash;

async function hash(password) {
    return await bcrypt.hash(password, 10);
}