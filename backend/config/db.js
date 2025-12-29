import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");
} catch (err) {
    console.error("❌ DB Error:", err);
}

export default sequelize;
