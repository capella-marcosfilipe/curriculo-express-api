/**
 * This model represents the Curriculum or Resume (Currículo in Portuguese) entity in the database.
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Curriculum extends Model {
  
  declare id: string;
  declare title: string; // Ex: "Currículo Focado em Desenvolvimento"
  declare userId: string; // Dono do currículo
  declare statementId: string; // Resumo associado ao currículo

  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Curriculum.init(
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
    // Foreign Key to User
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
    // Foreign Key to Statement
    statementId: {
      type: DataTypes.UUID,
      allowNull: false, // Statements are required for a curriculum
      references: {
        model: 'statements',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // Do not allow deleting a statement if it's in use
    },
  },
  {
    sequelize,
    modelName: 'Curriculum',
    tableName: 'curriculums',
    timestamps: true,
  }
);

export default Curriculum;