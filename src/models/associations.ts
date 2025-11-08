import User from "./UserModel";
import Education from "./EducationModel";

export function defineAssociations() {
    // User has many Educations
    User.hasMany(Education, {
        foreignKey: 'userId',
        as: 'educations',
    });

    // Education belongs to a User
    Education.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });
}