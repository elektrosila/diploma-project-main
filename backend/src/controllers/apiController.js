const pool = require("../config/db");

exports.getVariants = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id AS id,
        v.name AS name,
        CASE
          WHEN COUNT(q.id) = 0 THEN NULL
          ELSE JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', q.id,
              'text', q.text,
              'body', q.body,
              'image', q.image,
              'correctAnswer', q.correct_answer,
              'answerType', q.answer_type,
              'topic', json_build_object(
                'id', t.id,
                'name', t.name
              )
            )
          )
        END AS questions
      FROM Variants v
      LEFT JOIN Questions_Variants qv ON v.id = qv.variant_id
      LEFT JOIN Questions q ON q.id = qv.question_id
      LEFT JOIN Topics t ON q.topic_id = t.id
      GROUP BY v.id, v.name
      ORDER BY v.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getTopics = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, questions_type AS "questionsType" FROM topics`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', q.id,
              'text', q.text,
              'body', q.body,
              'image', q.image,
              'correctAnswer', q.correct_answer,
              'answerType', q.answer_type,
              'topic', json_build_object(
                'id', t.id,
                'name', t.name
              )
            )
          ) FILTER (WHERE q.id IS NOT NULL),
          '[]'
        ) AS questions
      FROM Questions q
      LEFT JOIN Topics t ON q.topic_id = t.id
    `);
    res.json(result.rows[0].questions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.createQuestion = async (req, res) => {
  const { text, correct_answer, answer_type, topic_id, body } = req.body;
  const imageFile = req.file;
  const imagePath = imageFile ? imageFile.filename : null;

  console.log(
    "New question:",
    text,
    correct_answer,
    answer_type,
    topic_id,
    body,
    imagePath
  );

  try {
    const result = await pool.query(
      `INSERT INTO Questions (text, correct_answer, answer_type, topic_id, body, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [text, correct_answer, answer_type, topic_id, body, imagePath]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create question" });
  }
};

exports.createVariant = async (req, res) => {
  const { name, questionIds } = req.body;

  if (!name || !questionIds || !Array.isArray(questionIds)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "INSERT INTO Variants (name) VALUES ($1) RETURNING *",
      [name]
    );
    const newVariant = result.rows[0];

    const insertPromises = questionIds.map((questionId) =>
      client.query(
        "INSERT INTO Questions_Variants (question_id, variant_id) VALUES ($1, $2)",
        [questionId, newVariant.id]
      )
    );

    await Promise.all(insertPromises);
    await client.query("COMMIT");

    res.json({ message: "Variant created successfully", variant: newVariant });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create variant" });
  } finally {
    client.release();
  }
};

exports.createAttempt = async (req, res) => {
  const { variant_id, total_questions, correct_questions, successful } =
    req.body;
  const userId = req.userId;

  if (
    !userId ||
    !variant_id ||
    total_questions == null ||
    correct_questions == null ||
    successful == null
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Attempts (user_id, variant_id, total_questions, correct_questions, successful)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [userId, variant_id, total_questions, correct_questions, successful]
    );

    res.status(201).json({ message: "Attempt saved", attempt: result.rows[0] });
  } catch (err) {
    console.error("Error creating attempt:", err);
    res.status(500).json({ error: "Failed to save attempt" });
  }
};

exports.getUserAttempts = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      `SELECT * FROM Attempts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};
