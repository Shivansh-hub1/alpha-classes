import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

const globalForDb = globalThis as unknown as { pool?: Pool; initPromise?: Promise<void>; initVersion?: number };

// bump this when SCHEMA gains new tables/columns — ensures migrations
// re-run even inside warm server instances
const SCHEMA_VERSION = 4;

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl:
      !connectionString || connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
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
  category TEXT NOT NULL DEFAULT 'General',
  sort INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  test_id INT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  q_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
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
  course_id INT REFERENCES courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Er. Shivansh Verma',
  category TEXT NOT NULL DEFAULT 'Preparation Guide',
  tags TEXT NOT NULL DEFAULT 'bikapur,coaching,exams',
  read_time INT NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_materials_created ON materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at DESC);

-- Migrations for existing schemas
ALTER TABLE tests ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT NOT NULL DEFAULT '';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS course_id INT REFERENCES courses(id) ON DELETE SET NULL;
`;

export const COURSES_SEED: Array<[string, string, string, string, string, string, number, number, boolean, number]> = [
  ["class-9-10-foundation", "Class 9–10 Foundation", "Foundation", "📚", "Build strong concepts in Maths, Science and English with NCERT-focused teaching and regular practice.", "NCERT-based teaching|Weekly practice tests|Doubt clearing sessions|Printed + PDF notes", 120, 699, false, 1],
  ["jee-preparation", "JEE Preparation", "Competitive", "🎯", "Physics, Chemistry and Maths with regular practice tests, PYQs and rank-focused preparation.", "Full syllabus coverage|Previous year questions|Weekly mock tests|Doubt support", 280, 1499, true, 2],
  ["neet-preparation", "NEET Preparation", "Medical", "🔬", "Biology, Physics and Chemistry with doubt support and NCERT-first approach for NEET.", "NCERT-first approach|Chapter-wise tests|Doubt support|Revision batches", 320, 1499, true, 3],
  ["ssc-complete-course", "SSC Complete Course", "Govt Exams", "📝", "Quant, Reasoning, English and General Awareness — complete preparation for SSC exams.", "All four subjects|Daily practice|Mock test series|Exam pattern updates", 200, 899, false, 4],
  ["web-development", "Web Development", "Technology", "💻", "HTML, CSS, JavaScript and modern project-based learning to make you job-ready.", "Project-based learning|Live coding classes|Portfolio building|Interview preparation", 90, 799, false, 5],
  ["computer-career-skills", "Computer & Career Skills", "Skills", "📈", "Practical computer skills for college and job readiness — Office, internet, communication.", "MS Office training|Typing practice|Email & internet skills|Interview readiness", 60, 499, false, 6],
];

export const TESTS_SEED: Array<[string, string, string, number, string, number, Array<[string, string[], number, string]>]> = [
  ["class-10-science", "Class 10 Science Foundation Test", "Chapter-wise practice test covering Physics, Chemistry and Biology from the Class 10 NCERT syllabus.", 15, "Foundation", 1, [
    ["The SI unit of electric current is:", ["Volt", "Ampere", "Ohm", "Watt"], 1, "Ampere (A) is the SI unit of electric current, defined as one coulomb of charge per second."],
    ["The chemical formula of quicklime is:", ["CaCO₃", "Ca(OH)₂", "CaO", "CaSO₄"], 2, "Quicklime is Calcium Oxide (CaO). When reacted with water, it forms slaked lime Ca(OH)₂."],
    ["Which gas is evolved when a metal reacts with a dilute acid?", ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], 1, "Metals displace hydrogen from dilute acids (e.g. Zn + 2HCl → ZnCl₂ + H₂↑)."],
    ["The pH of a neutral solution at 25°C is:", ["0", "7", "10", "14"], 1, "Pure water at 25°C has [H⁺] = 10⁻⁷ M, yielding a pH of 7 (neutral)."],
    ["Milk turns into curd due to the action of:", ["Yeast", "Virus", "Bacteria (Lactobacillus)", "Fungi"], 2, "Lactobacillus bacteria ferment lactose into lactic acid, coagulating milk proteins into curd."],
    ["Who is known as the father of genetics for his laws of inheritance?", ["Darwin", "Mendel", "Newton", "Pasteur"], 1, "Gregor Mendel conducted pioneering hybridization experiments on pea plants."],
    ["The focal length of a plane mirror is:", ["Zero", "Equal to its radius", "Infinity", "Negative"], 2, "A plane mirror is considered a sphere of infinite radius of curvature, so focal length f = R/2 = ∞."],
    ["Which of the following is a renewable source of energy?", ["Coal", "Petroleum", "Biogas", "Natural gas"], 2, "Biogas is produced from organic biomass breakdown and is continuously renewable."],
  ]],
  ["jee-weekly-test", "JEE Main Weekly Mock Test", "Weekly practice test for JEE aspirants covering Physics, Chemistry and Mathematics.", 20, "JEE Main", 2, [
    ["The dimensional formula of pressure is:", ["[ML⁻¹T⁻²]", "[MLT⁻²]", "[ML²T⁻²]", "[ML⁻²T⁻¹]"], 0, "Pressure = Force / Area = [MLT⁻²] / [L²] = [ML⁻¹T⁻²]."],
    ["If the velocity of a particle is v = 3t², then acceleration at t = 2 s is:", ["6 m/s²", "12 m/s²", "9 m/s²", "18 m/s²"], 1, "a = dv/dt = d(3t²)/dt = 6t. At t = 2 s, a = 6(2) = 12 m/s²."],
    ["For an ideal gas, which quantity is constant in an isothermal process?", ["Pressure", "Volume", "Temperature", "Entropy"], 2, "By definition, an isothermal process occurs at constant temperature (ΔT = 0)."],
    ["The value of ∫ 2x dx is:", ["2x² + C", "x² + C", "x + C", "2 + C"], 1, "∫ 2x dx = 2(x²/2) + C = x² + C."],
    ["Two resistors of 6 Ω each connected in parallel give an equivalent resistance of:", ["12 Ω", "6 Ω", "3 Ω", "1.5 Ω"], 2, "1/R_eq = 1/6 + 1/6 = 2/6 = 1/3 => R_eq = 3 Ω."],
    ["The escape velocity from the surface of the Earth is approximately:", ["7.9 km/s", "11.2 km/s", "9.8 km/s", "15.0 km/s"], 1, "v_e = √(2GM/R) ≈ 11.2 km/s at Earth's surface."],
    ["If the roots of x² − 5x + 6 = 0 are α and β, then α + β equals:", ["5", "6", "−5", "1"], 0, "Sum of roots α + β = -b/a = -(-5)/1 = 5."],
    ["The hybridisation of carbon in ethyne (C₂H₂) is:", ["sp³", "sp²", "sp", "dsp²"], 2, "In ethyne (H-C≡C-H), each carbon forms one sigma bond to H and one sigma bond to C, giving sp hybridisation."],
  ]],
  ["neet-biology-sprint", "NEET Biology Chapter Test", "Rapid-fire practice test for NEET covering Cell Biology, Genetics, and Human Physiology.", 15, "NEET", 3, [
    ["Which cell organelle is known as the 'powerhouse of the cell'?", ["Golgi apparatus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], 1, "Mitochondria produce ATP through oxidative phosphorylation."],
    ["The master control center / master gland of the endocrine system is:", ["Thyroid", "Adrenal", "Pituitary gland", "Pancreas"], 2, "The pituitary gland releases trophic hormones regulating other endocrine glands."],
    ["In DNA, adenine pairs with thymine via how many hydrogen bonds?", ["1", "2", "3", "4"], 1, "Adenine pairs with thymine via 2 hydrogen bonds (A=T); guanine pairs with cytosine via 3 (G≡C)."],
    ["Which blood group is known as the universal donor in the ABO system?", ["AB+", "O-", "A+", "B-"], 1, "O- lacks A, B, and Rh antigens, minimizing immune rejection across recipients."],
    ["The functional and structural unit of the human kidney is:", ["Nephron", "Neuron", "Alveoli", "Glomerulus"], 0, "Nephrons filter blood, reabsorb nutrients and secrete waste to form urine."],
  ]],
  ["ssc-mock-test", "SSC CGL General Mock Test", "Full mock test covering Quantitative Aptitude, Reasoning, English and General Awareness for SSC exams.", 15, "SSC", 4, [
    ["Find the next number in the series: 2, 5, 8, 11, ?", ["13", "14", "15", "16"], 1, "Common difference is +3. 11 + 3 = 14."],
    ["The HCF of 12 and 18 is:", ["2", "3", "6", "9"], 2, "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Highest common factor is 6."],
    ["Which is the largest planet in our solar system?", ["Earth", "Mars", "Jupiter", "Saturn"], 2, "Jupiter is the largest planet with a radius roughly 11 times that of Earth."],
    ["Who was the first President of India?", ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "S. Radhakrishnan", "Mahatma Gandhi"], 1, "Dr. Rajendra Prasad served as the first President from 1950 to 1962."],
    ["Who wrote the Indian National Anthem?", ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subhash Chandra Bose"], 1, "Rabindranath Tagore composed 'Jana Gana Mana'."],
    ["Choose the synonym of 'ABUNDANT':", ["Scarce", "Plentiful", "Tiny", "Rare"], 1, "Abundant means existing or available in large quantities; plentiful."],
    ["The currency of Japan is:", ["Yuan", "Won", "Yen", "Ringgit"], 2, "The official currency of Japan is the Japanese Yen (¥)."],
    ["If a train travels 360 km in 4 hours, its speed is:", ["80 km/h", "90 km/h", "100 km/h", "120 km/h"], 1, "Speed = Distance / Time = 360 / 4 = 90 km/h."],
  ]],
];

const MATERIALS_FALLBACK: Material[] = [
  {
    id: 1,
    title: "Class 10 Science Formula & Quick Revision Sheet",
    category: "notes",
    kind: "pdf",
    description: "Comprehensive formula sheet covering all Physics formulas and Chemistry reactions for CBSE Class 10 Board exams.",
    url: null,
    file_name: "Class_10_Science_Formula_Sheet.pdf",
    file_size: 1420000,
    downloads: 1250,
    course_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "JEE Main Physics 10-Year Chapterwise PYQ Book",
    category: "book",
    kind: "link",
    description: "Complete compilation of JEE Main Physics previous year questions with detailed step-by-step solutions (Google Drive).",
    url: "https://drive.google.com",
    file_name: null,
    file_size: null,
    downloads: 2430,
    course_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "NEET Biology NCERT High-Yield Diagrams & Mindmaps",
    category: "notes",
    kind: "pdf",
    description: "All NCERT Biology labeled diagrams and high-yield concept mindmaps for fast last-minute revision.",
    url: null,
    file_name: "NEET_Biology_NCERT_Diagrams.pdf",
    file_size: 2150000,
    downloads: 3100,
    course_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "SSC CGL Quantitative Aptitude Short Tricks Handbook",
    category: "test-series",
    kind: "pdf",
    description: "Speed calculation tricks for percentages, ratio, time & work, and algebra for SSC CGL & CHSL exams.",
    url: null,
    file_name: "SSC_CGL_Quant_Tricks.pdf",
    file_size: 980000,
    downloads: 1890,
    course_id: null,
    created_at: new Date().toISOString(),
  },
];

export const BLOGS_SEED: Array<{
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  read_time: number;
  created_at: string;
}> = [
  {
    slug: "best-coaching-in-bikapur-guide",
    title: "How to Choose the Best Coaching in Bikapur for Class 9, 10 & Board Exams",
    excerpt: "Looking for top coaching in Bikapur? Discover the 5 essential factors: Kota-standard conceptual teaching, regular test series, dedicated doubt clearing, and track record.",
    category: "Coaching Guide",
    author: "Er. Shivansh Verma",
    tags: "best coaching in bikapur,coaching in bikapur,alpha classes bikapur,class 10 coaching",
    read_time: 4,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    content: `Choosing the right coaching institute is one of the most critical decisions a student and their parents make in Bikapur. With board exams becoming increasingly application-oriented, relying solely on school lectures or rote learning is no longer sufficient.

### 1. Kota-Standard Conceptual Teaching
Many institutes focus merely on finishing chapters rather than building fundamental concepts. At Alpha Classes Bikapur, our teachers focus on first-principles understanding in Mathematics and Science, ensuring students know *why* a theorem works before memorizing formulas.

### 2. Timed Weekly Test Series with Detailed Solutions
Merely studying theory does not guarantee high marks. Weekly mock tests simulate actual board examination environments, training students in time management, precision, and reducing exam anxiety.

### 3. Dedicated 1-on-1 Doubt Clearing
In large batches, shy students often hesitate to ask questions. A genuine top coaching institute in Bikapur must provide daily doubt hours where any student can sit with faculty to resolve conceptual hurdles.

### 4. Comprehensive Study Materials & Formula Sheets
Handwritten crisp notes, NCERT line-by-line summaries, and 10-year chapterwise PYQs save countless hours of revision before final exams.

### Visit Alpha Classes in Bikapur
Centrally located on Main Road near Tehsil / Block Office, Alpha Classes provides modern digital classrooms and free demo sessions. Book your demo today!`,
  },
  {
    slug: "crack-jee-neet-preparation-bikapur",
    title: "Cracking JEE & NEET from Bikapur: Complete Preparation Strategy & Roadmap",
    excerpt: "You do not need to migrate to Kota to crack JEE Main or NEET. Learn how Bikapur students can achieve top percentile scores with disciplined self-study, NCERT mastery, and test analysis.",
    category: "JEE & NEET",
    author: "Er. Shivansh Verma",
    tags: "jee coaching in bikapur,neet coaching in bikapur,alpha classes,best coaching in bikapur",
    read_time: 5,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    content: `Every year, thousands of students from Ayodhya and Bikapur travel to distant coaching hubs like Kota or Lucknow. However, modern competitive exams like JEE Main and NEET UG strictly adhere to the NCERT syllabus. With the right local mentorship and rigorous online test series, cracking top national ranks from Bikapur is entirely achievable.

### Phase 1: NCERT as the Bible (Physics, Chemistry, Biology)
- **NEET:** Over 90% of Biology and Chemistry questions are directly derived from NCERT lines.
- **JEE Main:** Inorganic Chemistry and Physics fundamentals are grounded in NCERT theory and exemplar problems.

### Phase 2: High-Volume Question Practice
Theoretical knowledge without solving previous year questions (PYQs) leads to negative marking. Practice at least 40-50 quality MCQs per subject daily.

### Phase 3: Simulated Online Mock Tests & Score Analytics
Alpha Classes provides a dedicated online test runner matching NTA exam interfaces. Instant accuracy metrics, time-spent analysis, and step-by-step solutions highlight weak areas for immediate remediation.

### Join Alpha Classes JEE & NEET Batches
Experience rigorous preparation right in Bikapur with personalized faculty guidance.`,
  },
  {
    slug: "class-10-science-maths-board-strategy",
    title: "Scoring 95%+ in CBSE & UP Board Class 10 Science and Maths",
    excerpt: "Proven study blueprint for Class 9 and 10 students to score above 95% in board examinations with smart chapter prioritization and weekly testing.",
    category: "Board Strategy",
    author: "Er. Shivansh Verma",
    tags: "class 10 coaching in bikapur,maths coaching in bikapur,science coaching,alpha classes bikapur",
    read_time: 4,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    content: `Class 10 is the stepping stone for competitive exam readiness. Here is the step-by-step blueprint followed by Alpha Classes top rankers:

1. **Daily Problem Solving:** Dedicate 45 minutes daily to Maths problem sets.
2. **Formula & Diagram Flashcards:** Keep high-yield Biology diagrams and Physics formulas on flashcards for daily 10-minute reviews.
3. **Weekly Test Series:** Take the chapter-wise mock tests on Alpha Classes Test portal every Sunday.
4. **Targeted Doubt Solving:** Clear questions within 24 hours rather than letting confusion accumulate before exams.`,
  },
];

async function migrate() {
  if (!connectionString) return;
  const client = await pool.connect();
  try {
    await client.query(SCHEMA);
    const { rows } = await client.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM courses");
    if (Number(rows[0].count) === 0) {
      for (const c of COURSES_SEED) {
        await client.query(
          "INSERT INTO courses (slug, title, level, icon, description, highlights, classes_count, price, featured, sort) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING",
          c
        );
      }
      for (const t of TESTS_SEED) {
        const r = await client.query(
          "INSERT INTO tests (slug, title, description, duration_min, category, sort) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO UPDATE SET category = EXCLUDED.category RETURNING id",
          [t[0], t[1], t[2], t[3], t[4], t[5]]
        );
        const testId = r.rows[0]?.id;
        if (testId) {
          let i = 0;
          for (const [text, options, correct, explanation] of t[6]) {
            await client.query(
              "INSERT INTO questions (test_id, q_text, options, correct, explanation, sort) VALUES ($1,$2,$3,$4,$5,$6)",
              [testId, text, JSON.stringify(options), correct, explanation || "", i++]
            );
          }
        }
      }
    }

    // Seed initial blogs if empty
    const blogCountRes = await client.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM blogs");
    if (Number(blogCountRes.rows[0].count) === 0) {
      for (const b of BLOGS_SEED) {
        await client.query(
          "INSERT INTO blogs (slug, title, excerpt, content, author, category, tags, read_time, published, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,$9,$9) ON CONFLICT (slug) DO NOTHING",
          [b.slug, b.title, b.excerpt, b.content, b.author, b.category, b.tags, b.read_time, b.created_at]
        );
      }
    }
  } finally {
    client.release();
  }
}

export function ensureDb(): Promise<void> {
  if (!connectionString) return Promise.resolve();
  if (!globalForDb.initPromise || globalForDb.initVersion !== SCHEMA_VERSION) {
    globalForDb.initVersion = SCHEMA_VERSION;
    globalForDb.initPromise = migrate().catch((e) => {
      globalForDb.initPromise = undefined;
      console.warn("DB migration warning (using seed/offline fallback if DB down):", e?.message || e);
    });
  }
  return globalForDb.initPromise;
}

// ---------- shared types ----------
export type Course = {
  id: number;
  slug: string;
  title: string;
  level: string;
  icon: string;
  description: string;
  highlights: string;
  classes_count: number;
  price: number;
  featured: boolean;
};

export type Test = {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration_min: number;
  category: string;
  question_count: number;
};

export type Question = {
  id: number;
  q_text: string;
  options: string[];
  correct?: number;
  explanation?: string;
};

export type Material = {
  id: number;
  title: string;
  category: string;
  kind: string;
  description: string;
  url: string | null;
  file_name: string | null;
  file_size: number | null;
  downloads: number;
  course_id: number | null;
  course_title?: string | null;
  created_at: string;
};

export type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  read_time: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type StudentWithCourses = {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  courses: Array<{ id: number; title: string; slug: string }>;
};

// ---------- queries with safe fallbacks ----------

export async function getCourses(): Promise<Course[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Course>(
      "SELECT id, slug, title, level, icon, description, highlights, classes_count, price, featured FROM courses ORDER BY sort, id"
    );
    if (rows.length) return rows;
  } catch {}
  return COURSES_SEED.map((c, i) => ({
    id: i + 1,
    slug: c[0],
    title: c[1],
    level: c[2],
    icon: c[3],
    description: c[4],
    highlights: c[5],
    classes_count: c[6],
    price: c[7],
    featured: c[8],
  }));
}

export async function getCourse(slug: string): Promise<Course | null> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Course>(
      "SELECT id, slug, title, level, icon, description, highlights, classes_count, price, featured FROM courses WHERE slug = $1",
      [slug]
    );
    if (rows[0]) return rows[0];
  } catch {}
  const courses = await getCourses();
  return courses.find((c) => c.slug === slug) || null;
}

export async function getTests(): Promise<Test[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Test>(
      "SELECT t.id, t.slug, t.title, t.description, t.duration_min, COALESCE(t.category, 'General') AS category, COUNT(q.id)::int AS question_count FROM tests t LEFT JOIN questions q ON q.test_id = t.id GROUP BY t.id ORDER BY t.sort, t.id"
    );
    if (rows.length) return rows;
  } catch {}
  return TESTS_SEED.map((t, i) => ({
    id: i + 1,
    slug: t[0],
    title: t[1],
    description: t[2],
    duration_min: t[3],
    category: t[4],
    question_count: t[6].length,
  }));
}

export async function getTestWithQuestions(slug: string): Promise<{ test: Test; questions: Question[] } | null> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Test>(
      "SELECT id, slug, title, description, duration_min, COALESCE(category, 'General') AS category FROM tests WHERE slug = $1",
      [slug]
    );
    const test = rows[0];
    if (test) {
      const qs = await pool.query<{ id: number; q_text: string; options: string[]; correct: number; explanation: string }>(
        "SELECT id, q_text, options, correct, COALESCE(explanation, '') AS explanation FROM questions WHERE test_id = $1 ORDER BY sort, id",
        [test.id]
      );
      return {
        test: { ...test, question_count: qs.rows.length },
        questions: qs.rows.map((q) => ({
          id: q.id,
          q_text: q.q_text,
          options: Array.isArray(q.options) ? q.options : JSON.parse(String(q.options || "[]")),
          correct: q.correct,
          explanation: q.explanation,
        })),
      };
    }
  } catch {}

  const match = TESTS_SEED.find((t) => t[0] === slug);
  if (!match) return null;
  return {
    test: {
      id: TESTS_SEED.indexOf(match) + 1,
      slug: match[0],
      title: match[1],
      description: match[2],
      duration_min: match[3],
      category: match[4],
      question_count: match[6].length,
    },
    questions: match[6].map(([q_text, options, correct, explanation], idx) => ({
      id: idx + 1,
      q_text,
      options,
      correct,
      explanation: explanation || "",
    })),
  };
}

export async function createTest(data: {
  slug: string;
  title: string;
  description: string;
  duration_min: number;
  category?: string;
  questions: Array<{ q_text: string; options: string[]; correct: number; explanation?: string }>;
}): Promise<{ id: number; slug: string }> {
  await ensureDb();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query<{ id: number }>(
      "INSERT INTO tests (slug, title, description, duration_min, category, sort) VALUES ($1,$2,$3,$4,$5, 0) RETURNING id",
      [data.slug, data.title, data.description, data.duration_min, data.category || "General"]
    );
    const testId = res.rows[0].id;

    let sort = 0;
    for (const q of data.questions) {
      await client.query(
        "INSERT INTO questions (test_id, q_text, options, correct, explanation, sort) VALUES ($1,$2,$3,$4,$5,$6)",
        [testId, q.q_text, JSON.stringify(q.options), q.correct, q.explanation || "", sort++]
      );
    }
    await client.query("COMMIT");
    return { id: testId, slug: data.slug };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteTest(id: number): Promise<void> {
  await ensureDb();
  await pool.query("DELETE FROM tests WHERE id = $1", [id]);
}

export async function createCourse(data: {
  slug: string;
  title: string;
  level: string;
  icon?: string;
  description: string;
  highlights?: string;
  classes_count: number;
  price: number;
  featured?: boolean;
}): Promise<Course> {
  await ensureDb();
  const { rows } = await pool.query<Course>(
    "INSERT INTO courses (slug, title, level, icon, description, highlights, classes_count, price, featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
    [
      data.slug,
      data.title,
      data.level || "Foundation",
      data.icon || "📚",
      data.description,
      data.highlights || "",
      data.classes_count || 0,
      data.price || 0,
      !!data.featured,
    ]
  );
  return rows[0];
}

export async function updateCourse(
  id: number,
  data: Partial<Omit<Course, "id">>
): Promise<Course | null> {
  await ensureDb();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (fields.length === 0) return null;
  values.push(id);

  const { rows } = await pool.query<Course>(
    `UPDATE courses SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function deleteCourse(id: number): Promise<void> {
  await ensureDb();
  await pool.query("DELETE FROM courses WHERE id = $1", [id]);
}

// ============ Blogs ============
export async function getBlogs(limit = 100): Promise<Blog[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Blog>(
      "SELECT id, slug, title, excerpt, content, author, category, tags, read_time, published, created_at, updated_at FROM blogs WHERE published = true ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    if (rows.length) return rows;
  } catch {}
  return BLOGS_SEED.slice(0, limit).map((b, i) => ({
    id: i + 1,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    author: b.author,
    category: b.category,
    tags: b.tags,
    read_time: b.read_time,
    published: true,
    created_at: b.created_at,
    updated_at: b.created_at,
  }));
}

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Blog>(
      "SELECT id, slug, title, excerpt, content, author, category, tags, read_time, published, created_at, updated_at FROM blogs ORDER BY created_at DESC LIMIT 200"
    );
    if (rows.length) return rows;
  } catch {}
  return getBlogs();
}

export async function getBlog(slug: string): Promise<Blog | null> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<Blog>(
      "SELECT id, slug, title, excerpt, content, author, category, tags, read_time, published, created_at, updated_at FROM blogs WHERE slug = $1",
      [slug]
    );
    if (rows[0]) return rows[0];
  } catch {}
  const fallback = BLOGS_SEED.find((b) => b.slug === slug);
  if (!fallback) return null;
  return {
    id: 1,
    slug: fallback.slug,
    title: fallback.title,
    excerpt: fallback.excerpt,
    content: fallback.content,
    author: fallback.author,
    category: fallback.category,
    tags: fallback.tags,
    read_time: fallback.read_time,
    published: true,
    created_at: fallback.created_at,
    updated_at: fallback.created_at,
  };
}

export async function createBlog(data: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  category?: string;
  tags?: string;
  read_time?: number;
}): Promise<Blog> {
  await ensureDb();
  const { rows } = await pool.query<Blog>(
    "INSERT INTO blogs (slug, title, excerpt, content, author, category, tags, read_time, published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true) RETURNING *",
    [
      data.slug,
      data.title,
      data.excerpt,
      data.content,
      data.author || "Er. Shivansh Verma",
      data.category || "Coaching Guide",
      data.tags || "alpha classes,bikapur",
      data.read_time || 4,
    ]
  );
  return rows[0];
}

export async function updateBlog(
  id: number,
  data: Partial<Omit<Blog, "id" | "created_at">>
): Promise<Blog | null> {
  await ensureDb();
  const fields: string[] = ["updated_at = now()"];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined && key !== "updated_at") {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  values.push(id);
  const { rows } = await pool.query<Blog>(
    `UPDATE blogs SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function deleteBlog(id: number): Promise<void> {
  await ensureDb();
  await pool.query("DELETE FROM blogs WHERE id = $1", [id]);
}

// ============ Enrollments / User Access Control ============
export async function grantStudentAccess(studentId: number, courseId: number): Promise<void> {
  await ensureDb();
  await pool.query(
    "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) ON CONFLICT (student_id, course_id) DO NOTHING",
    [studentId, courseId]
  );
}

export async function revokeStudentAccess(studentId: number, courseId: number): Promise<void> {
  await ensureDb();
  await pool.query(
    "DELETE FROM enrollments WHERE student_id = $1 AND course_id = $2",
    [studentId, courseId]
  );
}

export async function getStudentsWithEnrollments(limit = 200): Promise<StudentWithCourses[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");
    const { rows } = await pool.query<StudentWithCourses>(
      `SELECT s.id, s.name, s.email, s.phone, s.created_at,
              COALESCE(
                json_agg(
                  json_build_object('id', c.id, 'title', c.title, 'slug', c.slug)
                ) FILTER (WHERE c.id IS NOT NULL),
                '[]'
              ) AS courses
       FROM students s
       LEFT JOIN enrollments e ON e.student_id = s.id
       LEFT JOIN courses c ON c.id = e.course_id
       GROUP BY s.id
       ORDER BY s.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  } catch (err) {
    console.warn("getStudentsWithEnrollments error:", err);
    return [];
  }
}

// ============ Materials with Course Destination ============
export async function getMaterials(
  limit = 200,
  filter?: { courseId?: number | null | "all" }
): Promise<Material[]> {
  try {
    await ensureDb();
    if (!connectionString) throw new Error("No DB");

    let query = `
      SELECT m.id, m.title, m.category, m.kind, m.description, m.url, m.file_name, m.file_size, m.downloads, m.course_id, m.created_at,
             c.title AS course_title
      FROM materials m
      LEFT JOIN courses c ON c.id = m.course_id
    `;
    const params: any[] = [];

    if (filter?.courseId === "all") {
      // return all materials regardless of course_id (for admin)
      query += " ORDER BY m.created_at DESC LIMIT $1";
      params.push(limit);
    } else if (typeof filter?.courseId === "number") {
      // return materials specifically for this course/batch
      query += " WHERE m.course_id = $1 ORDER BY m.created_at DESC LIMIT $2";
      params.push(filter.courseId, limit);
    } else {
      // default: free / public materials only (course_id IS NULL)
      query += " WHERE m.course_id IS NULL ORDER BY m.created_at DESC LIMIT $1";
      params.push(limit);
    }

    const { rows } = await pool.query<Material>(query, params);
    if (rows.length) return rows;
  } catch {}

  return MATERIALS_FALLBACK.slice(0, limit).map((m) => ({
    ...m,
    course_id: null,
    course_title: null,
  }));
}
