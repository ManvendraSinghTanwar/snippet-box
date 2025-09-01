import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create Collections table
  await queryInterface.createTable('collections', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#007bff',
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'folder',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Add collectionId to snippets table
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (!tableDescription.collectionId) {
    await queryInterface.addColumn('snippets', 'collectionId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'collections',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  }

  // Create default "General" collection
  await queryInterface.bulkInsert('collections', [{
    name: 'General',
    description: 'Default collection for snippets',
    color: '#6c757d',
    icon: 'folder',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Remove collectionId from snippets table
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (tableDescription.collectionId) {
    await queryInterface.removeColumn('snippets', 'collectionId');
  }

  // Drop Collections table
  await queryInterface.dropTable('collections');
}
