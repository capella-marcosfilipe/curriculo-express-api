import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

class User extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

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