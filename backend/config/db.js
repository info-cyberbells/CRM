import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    // process.env.DB_PASS
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        // dialect: process.env.DB_DIALECT,
        dialect: "mysql",
        logging: false,
        timezone: "+05:30",
    }
);

try {
    await sequelize.authenticate();
    await sequelize.query("SET time_zone = '+05:30'");
    console.log("✅ MySQL connected");
} catch (err) {
    console.error("❌ DB Error:", err);
}

export default sequelize;
