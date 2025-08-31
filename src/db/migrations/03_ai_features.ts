import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('snippets', 'aiExplanation', {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  });

  await queryInterface.addColumn('snippets', 'complexity', {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'beginner'
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('snippets', 'aiExplanation');
  await queryInterface.removeColumn('snippets', 'complexity');
}
