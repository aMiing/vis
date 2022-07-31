'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Publish = app.model.define(
    'publish',
    {
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
      created_at: DATE,
      updated_at: DATE,
    },
    {
      freezeTableName: true,
    }
  );

  return Publish;
};
