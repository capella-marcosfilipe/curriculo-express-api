import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Project extends Model {
    declare id: string;
    declare name: string;
    declare description: string | null;
    declare url: string | null;
    declare userId: string;

    // Timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Project.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true, // URL validation
      },
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
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
  }
);

export default Project;