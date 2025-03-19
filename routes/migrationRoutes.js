const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const gpt = require('../llms/gpt');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const generateAndExecuteMigration = require("../use-cases/generate-and-execute-migration");

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// API to generate and run Sequelize migrations
router.post("/migrate", upload.single('image'), async (req, res) => {
    try {
        let query, base64Image;

        const database = req.body.database;

        if(database){
            process.env.DB_DATABASE = database;
        }

        console.log("db::", process.env.DB_DATABASE);

        if (req.file) {
            const imagePath = path.join(uploadsDir, req.file.filename); // Use the correct path
            const imageData = fs.readFileSync(imagePath);

            base64Image = imageData.toString('base64');

            // Delete the uploaded file after processing
            fs.unlinkSync(imagePath);
        }

        if (base64Image) {
            query = await gpt.ask({ image: base64Image });

            console.log("image-desc:", query);

            query = query.replace(/```json|```/g, '').trim();

            //convert it to json
            query = JSON.parse(query);
        }
        else {
            query = req.body.query;
        }

        // const response = await generateAndExecuteMigration({ query, image: base64Image, mimeType: req.file.mimeType });
        const response = await generateAndExecuteMigration({ query, isFromImage: base64Image ? true: false });

        res.send(response);
    } catch (error) {
        console.error("Migration failed:", error);

        res.status(500).send({
            error: "Migration process failed",
            details: error.message || error
        });
    }
});

module.exports = router;