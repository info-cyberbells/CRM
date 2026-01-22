import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CaseCounter = sequelize.define("CaseCounter", {
    caseType: {
        type: DataTypes.ENUM("DIG", "CBH", "TD", "PWS", "NOSALE"),
        allowNull: false,
        unique: true,
        validate: {
        isIn: [["DIG", "CBH", "TD", "PWS", "NOSALE"]]
        }
    },
    caseNumber: {type: DataTypes.INTEGER, default: 0},
});

export default CaseCounter;