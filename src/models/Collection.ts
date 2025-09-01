import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../db';

const { INTEGER, STRING, TEXT, BOOLEAN, DATE } = DataTypes;

export interface Collection {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionCreationAttributes
  extends Optional<Collection, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'color' | 'icon' | 'isDefault'> {}

export interface CollectionInstance
  extends Model<Collection, CollectionCreationAttributes>,
    Collection {}

export const CollectionModel = sequelize.define<CollectionInstance>('Collection', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  description: {
    type: TEXT,
    allowNull: true,
  },
  color: {
    type: STRING,
    allowNull: true,
    defaultValue: '#007bff',
  },
  icon: {
    type: STRING,
    allowNull: true,
    defaultValue: 'folder',
  },
  isDefault: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
}, {
  tableName: 'collections',
  timestamps: true,
});

export default CollectionModel;
