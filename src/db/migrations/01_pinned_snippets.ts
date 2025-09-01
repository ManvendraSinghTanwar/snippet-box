import { DataTypes, QueryInterface } from 'sequelize';
const { INTEGER } = DataTypes;

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  // Check if column already exists before adding
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (!tableDescription.isPinned) {
    await queryInterface.addColumn('snippets', 'isPinned', {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  }
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  // Check if column exists before removing
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (tableDescription.isPinned) {
    await queryInterface.removeColumn('snippets', 'isPinned');
  }
};
