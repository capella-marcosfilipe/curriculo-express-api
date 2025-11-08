import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Experience extends Model {
    declare id: string;
    declare company: string;
    declare title: string;
    declare description: string | null;
    declare startDate: Date;
    declare endDate: Date | null;
    declare userId: string;

    // Timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Experience.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true, // Current job
        },
        // Foreign key to User model
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // Table name in the database
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'Experience',
        tableName: 'experiences', // Table name in the database
        timestamps: true,
    }
);

export default Experience;