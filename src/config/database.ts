import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log,
});

export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to database has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

export default sequelize;