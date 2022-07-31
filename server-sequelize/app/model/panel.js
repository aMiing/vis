'use strict';
/**
    width: {
      type: INTEGER,
      defaultValue: 0,
    },
    height: {
      type: INTEGER,
      defaultValue: 0,
    },
    sizeUnit: {
      type: STRING,
      defaultValue: '',
    },
    backgroundColor: {
      type: STRING,
      defaultValue: '',
    },
    fontSize: {
      type: INTEGER,
      defaultValue: 0,
    },
    fontWeight: {
      type: INTEGER,
      defaultValue: 0,
    },
    fontFamily: {
      type: STRING,
      defaultValue: '',
    },
    fontUnit: {
      type: STRING,
      defaultValue: '',
    },
 */

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Panel = app.model.define('panel', {
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
  });

  return Panel;
};
