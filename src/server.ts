import app from "./app";
import sequelize, { testConnection } from "./config/database";
import { defineAssociations } from "./models/associations";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await testConnection();

        defineAssociations();

        await sequelize.sync();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log("✅ Database synchronized successfully");
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
};

startServer();