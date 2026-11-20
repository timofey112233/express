import 'dotenv/config';
import app from './app.js';
import sequelize from './db.js';

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('SQLite connected');
        console.log('Users table ready');

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

start();