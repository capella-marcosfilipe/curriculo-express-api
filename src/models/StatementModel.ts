/**
 * This model represents the Statement or Summary (Resumo pessoal in Portuguese) entity in the database.
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Statement extends Model {
    declare id: string;
    declare title: string;
    declare text: string;
    declare userId: string;

    // Timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Statement.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'Statement',
        tableName: 'statements',
        timestamps: true,
    }
);

export default Statement;