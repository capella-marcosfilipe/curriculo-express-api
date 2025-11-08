import User from "./UserModel";
import Education from "./EducationModel";
import Experience from "./ExperienceModel";
import Skill from "./SkillModel";

export function defineAssociations() {
    // User <-> Education (1:N)
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

    // User <-> Experience (1:N)
    // User has many Experiences
    User.hasMany(Experience, {
        foreignKey: 'userId',
        as: 'experiences',
    });
    // Experience belongs to a User
    Experience.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });

    // User <-> Skill (1:N)
    // User has many Skills
    User.hasMany(Skill, {
        foreignKey: 'userId',
        as: 'skills',
    });
    // Skill belongs to a User
    Skill.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });
}