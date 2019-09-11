/*******
 Project 9 - REST API 
*******/

const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({ 
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, { sequelize }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      },
    });
  }
  return Course;
};

