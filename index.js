const app = require('./src/app');
const sequelize = require('./src/config/database.js');

sequelize.sync();
app.listen(3000, () => console.log('The app is running'));
