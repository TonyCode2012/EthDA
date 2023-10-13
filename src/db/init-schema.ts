import { DataTypes, QueryInterface } from 'sequelize';
import { withTransaction } from './db-utils';

export async function createRecordTable(sequelize: QueryInterface) {
  await withTransaction(sequelize, async (transaction) => {
    await sequelize.createTable( 'monitor',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        blockNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },
        chainType: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        transaction,
      },
    );
  });
}
