'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, DataTypes } = Sequelize;
    await queryInterface.createTable('publish', {
      _id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      id: STRING(32),
      title: STRING(30),
      snapshot: STRING,
      creator: STRING(20),
      viewCount: {
        type: INTEGER,
        defaultValue: 0,
      },
      followed: {
        type: INTEGER,
        defaultValue: 0,
      },
      style: {
        type: STRING(1024),
        defaultValue: '',
      },
      elements: {
        type: STRING(10240),
        defaultValue: '',
      },
      created_at: { type: DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DATE, defaultValue: DataTypes.NOW },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('publish');
  },
};
