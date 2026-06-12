const { Pool } = require("pg");
const seedData = require("../data/seedData.json");

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  const dockerStyleConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  if (dockerStyleConfig.host && dockerStyleConfig.user && dockerStyleConfig.database) {
    return dockerStyleConfig;
  }

  const fallbackConfig = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER || process.env.POSTGRES_USER,
    password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.POSTGRES_DB,
  };

  return fallbackConfig;
}

const pool = new Pool(getDatabaseConfig());

pool.ensureRequiredTables = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        questions_type VARCHAR(20) NOT NULL DEFAULT 'short'
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS variants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        body TEXT,
        image TEXT,
        correct_answer TEXT DEFAULT '',
        answer_type VARCHAR(20) NOT NULL DEFAULT 'short',
        topic_id INTEGER REFERENCES topics (id) ON DELETE SET NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS questions_variants (
        question_id INTEGER NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
        variant_id INTEGER NOT NULL REFERENCES variants (id) ON DELETE CASCADE,
        position INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (question_id, variant_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        variant_id INTEGER NOT NULL REFERENCES variants (id) ON DELETE CASCADE,
        total_questions INTEGER NOT NULL,
        correct_questions INTEGER NOT NULL,
        successful BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    for (const topic of seedData.topics) {
      await client.query(
        `
          INSERT INTO topics (id, name, questions_type)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            questions_type = EXCLUDED.questions_type
        `,
        [topic.id, topic.name, topic.questionsType]
      );
    }

    for (const variant of seedData.variants) {
      await client.query(
        `
          INSERT INTO variants (id, name)
          VALUES ($1, $2)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name
        `,
        [variant.id, variant.name]
      );
    }

    for (const question of seedData.questions) {
      await client.query(
        `
          INSERT INTO questions (
            id,
            text,
            body,
            image,
            correct_answer,
            answer_type,
            topic_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            text = EXCLUDED.text,
            body = EXCLUDED.body,
            image = EXCLUDED.image,
            correct_answer = EXCLUDED.correct_answer,
            answer_type = EXCLUDED.answer_type,
            topic_id = EXCLUDED.topic_id
        `,
        [
          question.id,
          question.text,
          question.body,
          question.image,
          question.correctAnswer,
          question.answerType,
          question.topicId,
        ]
      );

      await client.query(
        `
          INSERT INTO questions_variants (question_id, variant_id, position)
          VALUES ($1, $2, $3)
          ON CONFLICT (question_id, variant_id) DO UPDATE SET
            position = EXCLUDED.position
        `,
        [question.id, question.variantId, question.position]
      );
    }

    await client.query(`
      SELECT setval(
        pg_get_serial_sequence('variants', 'id'),
        COALESCE((SELECT MAX(id) FROM variants), 1),
        true
      )
    `);

    await client.query(`
      SELECT setval(
        pg_get_serial_sequence('questions', 'id'),
        COALESCE((SELECT MAX(id) FROM questions), 1),
        true
      )
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = pool;
