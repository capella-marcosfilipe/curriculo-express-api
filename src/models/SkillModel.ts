import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Skill extends Model {
    
    declare id: string;
    declare name: string;
    declare level: string | null;
    declare userId: string;

    // Timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Skill.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // Foreign Key
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
        modelName: 'Skill',
        tableName: 'skills',
        timestamps: true,
    }
);

export default Skill;