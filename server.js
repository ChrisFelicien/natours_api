import {} from "dotenv/config";
import app from "./app.js";
import connectToDB from "./utils/connectDB.js";

const PORT = process.env.PORT || 4000;

connectToDB();
app.listen(PORT, () => console.log(`the server is running on port ${PORT}`));
