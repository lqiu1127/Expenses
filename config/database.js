const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/expense-app',
    secret: crypto,
    db: 'expense-app'
}