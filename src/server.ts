import app from "./app";
import { testConnection } from "./config/database";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
};

startServer();