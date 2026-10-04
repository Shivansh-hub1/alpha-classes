import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

const globalForDb = globalThis as unknown as { pool?: Pool; initPromise?: Promise<void>; initVersion?: number };

// bump this when SCHEMA gains new tables/columns — ensures migrations
// re-run even inside warm server instances
const SCHEMA_VERSION = 2;

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL DEFAULT '',
  classes_count INT NOT NULL DEFAULT 0,
  price INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  course_id INT REFERENCES courses(id) ON DELETE SET NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_min INT NOT NULL DEFAULT 15,
  sort INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  test_id INT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  q_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INT NOT NULL,
  sort INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  test_id INT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_questions_test ON questions(test_id);
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'notes',
  kind TEXT NOT NULL DEFAULT 'pdf',
  description TEXT NOT NULL DEFAULT '',
  url TEXT,
  file_data BYTEA,
  file_name TEXT,
  file_size INT,
  downloads INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_materials_created ON materials(created_at DESC);
`;

const COURSES: Array<[string, string, string, string, string, string, number, number, boolean, number]> = [
  ["class-9-10-foundation", "Class 9–10 Foundation", "Foundation", "📚", "Build strong concepts in Maths, Science and English with NCERT-focused teaching and regular practice.", "NCERT-based teaching|Weekly practice tests|Doubt clearing sessions|Printed + PDF notes", 120, 699, false, 1],
  ["jee-preparation", "JEE Preparation", "Competitive", "🎯", "Physics, Chemistry and Maths with regular practice tests, PYQs and rank-focused preparation.", "Full syllabus coverage|Previous year questions|Weekly mock tests|Doubt support", 280, 1499, true, 2],
  ["neet-preparation", "NEET Preparation", "Medical", "🔬", "Biology, Physics and Chemistry with doubt support and NCERT-first approach for NEET.", "NCERT-first approach|Chapter-wise tests|Doubt support|Revision batches", 320, 1499, true, 3],
  ["ssc-complete-course", "SSC Complete Course", "Govt Exams", "📝", "Quant, Reasoning, English and General Awareness — complete preparation for SSC exams.", "All four subjects|Daily practice|Mock test series|Exam pattern updates", 200, 899, false, 4],
  ["web-development", "Web Development", "Technology", "💻", "HTML, CSS, JavaScript and modern project-based learning to make you job-ready.", "Project-based learning|Live coding classes|Portfolio building|Interview preparation", 90, 799, false, 5],
  ["computer-career-skills", "Computer & Career Skills", "Skills", "📈", "Practical computer skills for college and job readiness — Office, internet, communication.", "MS Office training|Typing practice|Email & internet skills|Interview readiness", 60, 499, false, 6],
];

const TESTS: Array<[string, string, string, number, number, Array<[string, string[], number]>]> = [
  ["class-10-science", "Class 10 Science", "Chapter-wise practice test covering Physics, Chemistry and Biology from the Class 10 NCERT syllabus.", 15, 1, [
    ["The SI unit of electric current is:", ["Volt", "Ampere", "Ohm", "Watt"], 1],
    ["The chemical formula of quicklime is:", ["CaCO₃", "Ca(OH)₂", "CaO", "CaSO₄"], 2],
    ["Which gas is evolved when a metal reacts with a dilute acid?", ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], 1],
    ["The pH of a neutral solution at 25°C is:", ["0", "7", "10", "14"], 1],
    ["Milk turns into curd due to the action of:", ["Yeast", "Virus", "Bacteria (Lactobacillus)", "Fungi"], 2],
    ["Who is known as the father of genetics for his laws of inheritance?", ["Darwin", "Mendel", "Newton", "Pasteur"], 1],
    ["The focal length of a plane mirror is:", ["Zero", "Equal to its radius", "Infinity", "Negative"], 2],
    ["Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Biogas", "Natural gas"], 2],
  ]],
  ["jee-weekly-test", "JEE Weekly Test", "Weekly practice test for JEE aspirants covering Physics, Chemistry and Mathematics.", 20, 2, [
    ["The dimensional formula of pressure is:", ["[ML⁻¹T⁻²]", "[MLT⁻²]", "[ML²T⁻²]", "[ML⁻²T⁻¹]"], 0],
    ["If the velocity of a particle is v = 3t², then acceleration at t = 2 s is:", ["6 m/s²", "12 m/s²", "9 m/s²", "18 m/s²"], 1],
    ["For an ideal gas, which quantity is constant in an isothermal process?", ["Pressure", "Volume", "Temperature", "Entropy"], 2],
    ["The value of ∫ 2x dx is:", ["2x² + C", "x² + C", "x + C", "2 + C"], 1],
    ["Two resistors of 6 Ω each connected in parallel give an equivalent resistance of:", ["12 Ω", "6 Ω", "3 Ω", "1.5 Ω"], 2],
    ["The escape velocity from the surface of the Earth is approximately:", ["7.9 km/s", "11.2 km/s", "9.8 km/s", "15.0 km/s"], 1],
    ["If the roots of x² − 5x + 6 = 0 are α and β, then α + β equals:", ["5", "6", "−5", "1"], 0],
    ["The hybridisation of carbon in ethyne (C₂H₂) is:", ["sp³", "sp²", "sp", "dsp²"], 2],
  ]],
  ["ssc-mock-test", "SSC Mock Test", "Full mock test covering Quantitative Aptitude, Reasoning, English and General Awareness for SSC exams.", 15, 3, [
    ["Find the next number in the series: 2, 5, 8, 11, ?", ["13", "14", "15", "16"], 1],
    ["The HCF of 12 and 18 is:", ["2", "3", "6", "9"], 2],
    ["Which is the largest planet in our solar system?", ["Earth", "Mars", "Jupiter", "Saturn"], 2],
    ["Who was the first President of India?", ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "S. Radhakrishnan", "Mahatma Gandhi"], 1],
    ["Who wrote the Indian National Anthem?", ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subhash Chandra Bose"], 1],
    ["Choose the synonym of 'ABUNDANT':", ["Scarce", "Plentiful", "Tiny", "Rare"], 1],
    ["The currency of Japan is:", ["Yuan", "Won", "Yen", "Ringgit"], 2],
    ["If a train travels 360 km in 4 hours, its speed is:", ["80 km/h", "90 km/h", "100 km/h", "120 km/h"], 1],
  ]],
];

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA);
    const { rows } = await client.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM courses");
    if (Number(rows[0].count) === 0) {
      for (const c of COURSES) {
        await client.query(
          "INSERT INTO courses (slug, title, level, icon, description, highlights, classes_count, price, featured, sort) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING",
          c
        );
      }
      for (const t of TESTS) {
        const r = await client.query(
          "INSERT INTO tests (slug, title, description, duration_min, sort) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (slug) DO NOTHING RETURNING id",
          [t[0], t[1], t[2], t[3], t[4]]
        );
        const testId = r.rows[0]?.id;
        if (testId) {
          let i = 0;
          for (const [text, options, correct] of t[5]) {
            await client.query(
              "INSERT INTO questions (test_id, q_text, options, correct, sort) VALUES ($1,$2,$3,$4,$5)",
              [testId, text, JSON.stringify(options), correct, i++]
            );
          }
        }
      }
    }
  } finally {
    client.release();
  }
}

export function ensureDb(): Promise<void> {
  if (!globalForDb.initPromise || globalForDb.initVersion !== SCHEMA_VERSION) {
    globalForDb.initVersion = SCHEMA_VERSION;
    globalForDb.initPromise = migrate().catch((e) => {
      globalForDb.initPromise = undefined;
      throw e;
    });
  }
  return globalForDb.initPromise;
}

// ---------- shared types ----------
export type Course = { id: number; slug: string; title: string; level: string; icon: string; description: string; highlights: string; classes_count: number; price: number; featured: boolean };
export type Test = { id: number; slug: string; title: string; description: string; duration_min: number; question_count: number };
export type Material = {
  id: number; title: string; category: string; kind: string; description: string;
  url: string | null; file_name: string | null; file_size: number | null; downloads: number; created_at: string;
};

// ---------- queries ----------
export async function getCourses(): Promise<Course[]> {
  await ensureDb();
  const { rows } = await pool.query<Course>("SELECT id, slug, title, level, icon, description, highlights, classes_count, price, featured FROM courses ORDER BY sort, id");
  return rows;
}

export async function getCourse(slug: string): Promise<Course | null> {
  await ensureDb();
  const { rows } = await pool.query<Course>("SELECT id, slug, title, level, icon, description, highlights, classes_count, price, featured FROM courses WHERE slug = $1", [slug]);
  return rows[0] || null;
}

export async function getTests(): Promise<Test[]> {
  await ensureDb();
  const { rows } = await pool.query<Test>(
    "SELECT t.id, t.slug, t.title, t.description, t.duration_min, COUNT(q.id)::int AS question_count FROM tests t LEFT JOIN questions q ON q.test_id = t.id GROUP BY t.id ORDER BY t.sort, t.id"
  );
  return rows;
}

export async function getTestWithQuestions(slug: string) {
  await ensureDb();
  const { rows } = await pool.query<Test & { duration_min: number }>(
    "SELECT id, slug, title, description, duration_min FROM tests WHERE slug = $1", [slug]
  );
  const test = rows[0];
  if (!test) return null;
  const qs = await pool.query<{ id: number; q_text: string; options: string[]; correct: number }>(
    "SELECT id, q_text, options, correct FROM questions WHERE test_id = $1 ORDER BY sort, id", [test.id]
  );
  return { test, questions: qs.rows };
}

export async function getMaterials(limit = 200): Promise<Material[]> {
  await ensureDb();
  const { rows } = await pool.query<Material>(
    "SELECT id, title, category, kind, description, url, file_name, file_size, downloads, created_at FROM materials ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return rows;
}
