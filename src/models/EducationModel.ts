import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

class Education extends Model {
    declare id: string;
    declare institution: string;
    declare degree: string; // ex.: Bacharelado, Tecnologo ...
    declare fieldOfStudy: string; // ex.: Ciência da Computação, Administração ...
    declare startDate: Date;
    declare endDate: Date | null;

    declare userId: string; // Foreign key to User model

    // Timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Education.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        institution: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        degree: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fieldOfStudy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        // Foreign key to User model
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
        modelName: 'Education',
        tableName: 'educations',
        timestamps: true,
    }
);

export default Education;