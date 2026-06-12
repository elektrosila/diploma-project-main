const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", "public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

router.get("/variants", apiController.getVariants);
router.get("/topics", apiController.getTopics);
router.get("/questions", apiController.getQuestions);
router.post("/questions", upload.single("image"), apiController.createQuestion);
router.post("/variants", apiController.createVariant);
router.post("/attempts", authMiddleware, apiController.createAttempt);
router.get("/attempts", authMiddleware, apiController.getUserAttempts);

module.exports = router;
