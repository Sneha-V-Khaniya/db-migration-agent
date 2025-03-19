const express = require("express");
const { exec } = require("child_process");
const router = express.Router();

const generateAndExecuteMigration = require("../use-cases/generate-and-execute-migration");

// API to generate and run Sequelize migrations
router.post("/migrate", async (req, res) => {
    try {
        const query = req.body.query;

        const response = await generateAndExecuteMigration(query);

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