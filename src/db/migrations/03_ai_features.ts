import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Check if columns already exist before adding
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (!tableDescription.aiExplanation) {
    await queryInterface.addColumn('snippets', 'aiExplanation', {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    });
  }

  if (!tableDescription.complexity) {
    await queryInterface.addColumn('snippets', 'complexity', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'beginner'
    });
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Check if columns exist before removing
  const tableDescription = await queryInterface.describeTable('snippets');
  
  if (tableDescription.aiExplanation) {
    await queryInterface.removeColumn('snippets', 'aiExplanation');
  }
  
  if (tableDescription.complexity) {
    await queryInterface.removeColumn('snippets', 'complexity');
  }
}
