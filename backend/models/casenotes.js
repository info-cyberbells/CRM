import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CaseNote = sequelize.define("CaseNote", {
  caseId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "case_id"
  },

  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "created_by_id"
  },

  createdByRole: {
    type: DataTypes.ENUM("Admin", "Tech", "Sale"),
    allowNull: false,
    field: "created_by_role"
  },

  noteType: {
    type: DataTypes.ENUM("General", "Urgent", "Follow-up"),
    allowNull: false,
    field: "note_type"
  },

  noteText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "note_text"
  }

}, {
  tableName: "case_notes",
  freezeTableName: true,
  createdAt: "created_at",       
  updatedAt: "updated_at"
});

export default CaseNote;