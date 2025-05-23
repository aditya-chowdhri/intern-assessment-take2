const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Task extends Model {}

Task.init(
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    //Add validation 
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: "Task", // Name your model
    timestamps: true, // Enable automatic creation of createdAt & updatedAt fields
    tableName: "Tasks", // Explicitly define the table name
  },
);

module.exports = Task;
