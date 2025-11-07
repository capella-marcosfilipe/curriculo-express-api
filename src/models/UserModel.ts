import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Method to compare passwords
    public async comparePassword(candidatePassword: string): Promise<boolean> {
        const hashedPassword = this.getDataValue('password');
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    }
);

User.addHook("beforeCreate", async (user: User) => {
    const password = user.getDataValue('password');

    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.setDataValue('password', hashedPassword);
    }
});

export default User;