import User from "./UserModel";
import Education from "./EducationModel";
import Experience from "./ExperienceModel";
import Skill from "./SkillModel";
import Project from "./ProjectModel";
import Statement from "./StatementModel";
import Curriculum from "./CurriculumModel";

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

    // User <-> Project (1:N)
    // User has many Projects
    User.hasMany(Project, {
        foreignKey: 'userId',
        as: 'projects',
    });
    // Project belongs to a User
    Project.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });

    // User <-> Statement (1:N)
    // A User can have multiple Statements
    User.hasMany(Statement, { 
        foreignKey: 'userId', 
        as: 'statements' 
    });
    // A Statement belongs to a User
    Statement.belongsTo(User, { 
        foreignKey: 'userId', 
        as: 'user' 
    });

    // User <-> Curriculum (1:N)
    // A User can have multiple Curriculums
    User.hasMany(Curriculum, { 
        foreignKey: 'userId', 
        as: 'curriculums' 
    });
    // A Curriculum belongs to a User
    Curriculum.belongsTo(User, { 
        foreignKey: 'userId', 
        as: 'user' 
    });

    // Curriculum <-> Statement (1:1)
    // A Curriculum belongs to a Statement
    Curriculum.belongsTo(Statement, { 
        foreignKey: 'statementId', 
        as: 'statement'
    });

    // A Statement can have many Curriculums
    Statement.hasMany(Curriculum, {
        foreignKey: 'statementId',
        as: 'curriculums'
    });

    // Curriculum <-> Education (N:M)
    Curriculum.belongsToMany(Education, {
        through: 'CurriculumEducations',
        as: 'educations',
    });
    Education.belongsToMany(Curriculum, {
        through: 'CurriculumEducations',
        as: 'curriculums',
    });

    // Curriculum <-> Experience (N:M)
    Curriculum.belongsToMany(Experience, {
        through: 'CurriculumExperiences',
        as: 'experiences',
    });
    Experience.belongsToMany(Curriculum, {
        through: 'CurriculumExperiences',
        as: 'curriculums',
    });

    // Curriculum <-> Skill (N:M)
    Curriculum.belongsToMany(Skill, {
        through: 'CurriculumSkills',
        as: 'skills',
    });
    Skill.belongsToMany(Curriculum, {
        through: 'CurriculumSkills',
        as: 'curriculums',
    });

    // Curriculum <-> Project (N:M)
    Curriculum.belongsToMany(Project, {
        through: 'CurriculumProjects',
        as: 'projects',
    });
    Project.belongsToMany(Curriculum, {
        through: 'CurriculumProjects',
        as: 'curriculums',
    });
}
