const bcrypt = require('bcryptjs');

/**
 * MOES/IMD Synthetic Demo Dataset Seeder for Capacity Connect LMS
 * Populates real MOES courses, enrollments, quiz attempts, competencies,
 * certificates, and assignments across 9 fictional learner users.
 */
async function seedDemoData(pool) {
  try {
    console.log('[DB-DEMO] Seeding MOES/IMD demo dataset...');

    // 1. Check if demo users already seeded
    const checkDemo = await pool.query(
      "SELECT COUNT(*) AS count FROM users WHERE email LIKE '%@demo.imd.training'"
    );
    if (parseInt(checkDemo.rows[0].count, 10) > 0) {
      console.log('[DB-DEMO] Demo users already seeded. Skipping.');
      return;
    }

    const passwordHash = await bcrypt.hash('password123', 10);

    // 2. Insert Synthetic Learner Users
    const syntheticUsersData = [
      { name: 'Arjun Mehta', email: 'arjun.mehta@demo.imd.training', bio: 'Senior Meteorological Assistant - Western Region' },
      { name: 'Neha Iyer', email: 'neha.iyer@demo.imd.training', bio: 'Observation Officer - Southern Circle' },
      { name: 'Rohan Kulkarni', email: 'rohan.kulkarni@demo.imd.training', bio: 'Radar Operator & Technician - Central Zone' },
      { name: 'Kavya Nair', email: 'kavya.nair@demo.imd.training', bio: 'Forecasting Trainee - NWP Center' },
      { name: 'Vivek Rao', email: 'vivek.rao@demo.imd.training', bio: 'Climate Services Analyst - National Data Center' },
      { name: 'Meera Joshi', email: 'meera.joshi@demo.imd.training', bio: 'Disaster Warning Specialist - Area Cyclone Warning Centre' },
      { name: 'Aditya Sen', email: 'aditya.sen@demo.imd.training', bio: 'Observational Network Supervisor' },
      { name: 'Nisha Kapoor', email: 'nisha.kapoor@demo.imd.training', bio: 'Hydromet & Precipitation Specialist' },
      { name: 'Rahul Menon', email: 'rahul.menon@demo.imd.training', bio: 'Satellite Meteorology Trainee' }
    ];

    const seededUserIds = [];

    for (const u of syntheticUsersData) {
      const uRes = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, bio)
         VALUES ($1, $2, $3, 'LEARNER', $4)
         RETURNING id`,
        [u.name, u.email, passwordHash, u.bio]
      );
      seededUserIds.push(uRes.rows[0].id);
    }

    // Resolve Main Learner ID
    const mainLearnerRes = await pool.query(
      "SELECT id FROM users WHERE email = 'learner@test.com' LIMIT 1"
    );
    const mainLearnerId = mainLearnerRes.rows[0].id;

    // 3. Fetch MOES Courses
    const coursesRes = await pool.query(
      "SELECT id, title, category FROM courses ORDER BY id ASC"
    );
    const moesCourses = coursesRes.rows;

    if (moesCourses.length === 0) {
      console.log('[DB-DEMO] No MOES courses found. Skipping demo seed.');
      return;
    }

    // 4. Competencies Setup
    const compData = [
      { name: 'Surface & Upper-Air Observations', category: 'OBSERVATIONS', desc: 'Siting standards, instrument calibration, and observation coding (SYNOP/METAR).' },
      { name: 'Synoptic Weather Forecasting', category: 'FORECASTING', desc: 'Synoptic chart analysis, monsoon forecasting, and numerical guidance.' },
      { name: 'Doppler Weather Radar (DWR) Operations', category: 'RADAR', desc: 'Radar hardware maintenance, reflectivity, and radial velocity calibration.' },
      { name: 'Climate Data Analytics & Climatology', category: 'CLIMATE', desc: 'Climate data digitization, quality control, anomalies, and extreme trend analysis.' },
      { name: 'Disaster Warning & Emergency Dissemination', category: 'DISASTER_MANAGEMENT', desc: 'Area Cyclone Warning Centre protocols and CAP-based alert dissemination.' }
    ];

    const compMap = {};
    for (const c of compData) {
      let compId;
      const existingComp = await pool.query(
        "SELECT id FROM competencies WHERE name = $1 LIMIT 1",
        [c.name]
      );
      if (existingComp.rows.length > 0) {
        compId = existingComp.rows[0].id;
      } else {
        const cIns = await pool.query(
          `INSERT INTO competencies (name, description, category)
           VALUES ($1, $2, $3) RETURNING id`,
          [c.name, c.desc, c.category]
        );
        compId = cIns.rows[0].id;
      }
      compMap[c.category] = compId;
    }

    // Link Competencies to MOES Courses
    for (let i = 0; i < moesCourses.length; i++) {
      const course = moesCourses[i];
      let targetCategory = 'OBSERVATIONS';
      if (course.title.includes('Forecasting')) targetCategory = 'FORECASTING';
      else if (course.title.includes('Radar') || course.title.includes('DWR')) targetCategory = 'RADAR';
      else if (course.title.includes('Climate')) targetCategory = 'CLIMATE';
      else if (course.title.includes('Disaster') || course.title.includes('Warning')) targetCategory = 'DISASTER_MANAGEMENT';

      const compId = compMap[targetCategory];
      if (compId) {
        await pool.query(
          `INSERT INTO course_competencies (course_id, competency_id, required_level)
           VALUES ($1, $2, 'INTERMEDIATE')
           ON CONFLICT DO NOTHING`,
          [course.id, compId]
        );
      }
    }

    // Seed Learner Competencies for Main Learner
    const mainCompetencyLevels = [
      { category: 'OBSERVATIONS', level: 'ADVANCED' },
      { category: 'FORECASTING', level: 'INTERMEDIATE' },
      { category: 'RADAR', level: 'BEGINNER' },
      { category: 'CLIMATE', level: 'INTERMEDIATE' },
      { category: 'DISASTER_MANAGEMENT', level: 'BEGINNER' }
    ];

    for (const item of mainCompetencyLevels) {
      const compId = compMap[item.category];
      if (compId) {
        await pool.query(
          `INSERT INTO learner_competencies (user_id, competency_id, proficiency_level, acquired_from)
           VALUES ($1, $2, $3, 'ASSESSMENT')
           ON CONFLICT (user_id, competency_id) DO UPDATE SET proficiency_level = EXCLUDED.proficiency_level`,
          [mainLearnerId, compId, item.level]
        );
      }
    }

    // Seed Learner Competencies for Synthetic Learners
    const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    for (let idx = 0; idx < seededUserIds.length; idx++) {
      const uid = seededUserIds[idx];
      const categories = Object.keys(compMap);
      for (let cIdx = 0; cIdx < categories.length; cIdx++) {
        const cat = categories[cIdx];
        const assignedLevel = levels[(idx + cIdx) % levels.length];
        await pool.query(
          `INSERT INTO learner_competencies (user_id, competency_id, proficiency_level, acquired_from)
           VALUES ($1, $2, $3, 'COURSE')
           ON CONFLICT DO NOTHING`,
          [uid, compMap[cat], assignedLevel]
        );
      }
    }

    // 5. Seed Enrollments & Learning Progress
    // Main Learner (learner@test.com) enrolled in all MOES courses
    for (let i = 0; i < moesCourses.length; i++) {
      const course = moesCourses[i];
      const status = i === 0 ? 'COMPLETED' : 'ACTIVE';
      const completedAt = i === 0 ? new Date() : null;

      const eRes = await pool.query(
        `INSERT INTO enrollments (user_id, course_id, status, completed_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status
         RETURNING id`,
        [mainLearnerId, course.id, status, completedAt]
      );
      const enrollmentId = eRes.rows[0].id;

      // Fetch Modules for this course
      const modulesRes = await pool.query(
        "SELECT id FROM modules WHERE course_id = $1 ORDER BY order_index ASC",
        [course.id]
      );

      const modules = modulesRes.rows;
      const completedCount = i === 0 ? modules.length : Math.max(1, modules.length - (i + 1));

      for (let m = 0; m < modules.length; m++) {
        const isComp = m < completedCount;
        await pool.query(
          `INSERT INTO learning_progress (enrollment_id, module_id, completed, completed_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (enrollment_id, module_id) DO UPDATE SET completed = EXCLUDED.completed`,
          [enrollmentId, modules[m].id, isComp, isComp ? new Date() : null]
        );
      }

      // Add Certificate if course completed
      if (status === 'COMPLETED') {
        const certCode = `IMD-CERT-2026-00${course.id}`;
        await pool.query(
          `INSERT INTO certificates (certificate_code, user_id, course_id, enrollment_id, issue_date, metadata)
           VALUES ($1, $2, $3, $4, NOW(), $5)
           ON CONFLICT (user_id, course_id) DO NOTHING`,
          [certCode, mainLearnerId, course.id, enrollmentId, JSON.stringify({ grade: 'Distinction', score: 92 })]
        );
      }
    }

    // Enroll Synthetic Learners
    for (let uIdx = 0; uIdx < seededUserIds.length; uIdx++) {
      const uid = seededUserIds[uIdx];
      // Enroll each in 2-4 courses
      const numCourses = (uIdx % 3) + 2;
      for (let cIdx = 0; cIdx < numCourses; cIdx++) {
        const course = moesCourses[(uIdx + cIdx) % moesCourses.length];
        const isCompleted = (uIdx + cIdx) % 3 === 0;
        const status = isCompleted ? 'COMPLETED' : 'ACTIVE';

        const eRes = await pool.query(
          `INSERT INTO enrollments (user_id, course_id, status, completed_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [uid, course.id, status, isCompleted ? new Date() : null]
        );

        if (eRes.rows.length > 0 && isCompleted) {
          const certCode = `IMD-CERT-2026-${uid}-${course.id}`;
          await pool.query(
            `INSERT INTO certificates (certificate_code, user_id, course_id, enrollment_id, issue_date, metadata)
             VALUES ($1, $2, $3, $4, NOW(), $5)
             ON CONFLICT (user_id, course_id) DO NOTHING`,
            [certCode, uid, course.id, eRes.rows[0].id, JSON.stringify({ grade: 'First Class', score: 86 })]
          );
        }
      }
    }

    // 6. Seed Quiz Attempts & Answers
    const quizzesRes = await pool.query("SELECT id, course_id, total_marks, passing_score FROM quizzes ORDER BY id ASC");
    const quizzes = quizzesRes.rows;

    const scoresList = [96, 92, 88, 84, 79, 74, 68, 61, 52];

    // Seed Main Learner Quiz Attempts
    for (let qIdx = 0; qIdx < Math.min(8, quizzes.length); qIdx++) {
      const quiz = quizzes[qIdx];
      const targetPct = scoresList[qIdx % scoresList.length];
      const totalMarks = parseFloat(quiz.total_marks) || 150;
      const score = Math.round((targetPct / 100) * totalMarks);
      const passed = targetPct >= (parseFloat(quiz.passing_score) || 60);

      const qaRes = await pool.query(
        `INSERT INTO quiz_attempts (quiz_id, user_id, score, percentage, passed, status, started_at, submitted_at)
         VALUES ($1, $2, $3, $4, $5, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
         RETURNING id`,
        [quiz.id, mainLearnerId, score, targetPct, passed]
      );
      const attemptId = qaRes.rows[0].id;

      // Seed quiz_attempt_answers for this attempt
      const questionsRes = await pool.query(
        "SELECT id, correct_answer, marks FROM quiz_questions WHERE quiz_id = $1 ORDER BY id ASC",
        [quiz.id]
      );
      for (const qRow of questionsRes.rows) {
        await pool.query(
          `INSERT INTO quiz_attempt_answers (attempt_id, question_id, user_answer, is_correct, marks_awarded)
           VALUES ($1, $2, $3, true, $4)`,
          [attemptId, qRow.id, qRow.correct_answer, qRow.marks || 10]
        );
      }
    }

    // Seed Synthetic Learners Quiz Attempts
    for (let uIdx = 0; uIdx < seededUserIds.length; uIdx++) {
      const uid = seededUserIds[uIdx];
      const numAttempts = (uIdx % 3) + 2;
      for (let aIdx = 0; aIdx < numAttempts; aIdx++) {
        const quiz = quizzes[(uIdx * 2 + aIdx) % quizzes.length];
        const targetPct = scoresList[(uIdx + aIdx) % scoresList.length];
        const totalMarks = parseFloat(quiz.total_marks) || 150;
        const score = Math.round((targetPct / 100) * totalMarks);
        const passed = targetPct >= (parseFloat(quiz.passing_score) || 60);

        const qaRes = await pool.query(
          `INSERT INTO quiz_attempts (quiz_id, user_id, score, percentage, passed, status, started_at, submitted_at)
           VALUES ($1, $2, $3, $4, $5, 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')
           RETURNING id`,
          [quiz.id, uid, score, targetPct, passed]
        );

        const attemptId = qaRes.rows[0].id;
        const questionsRes = await pool.query(
          "SELECT id, correct_answer, marks FROM quiz_questions WHERE quiz_id = $1 LIMIT 3",
          [quiz.id]
        );
        for (const qRow of questionsRes.rows) {
          await pool.query(
            `INSERT INTO quiz_attempt_answers (attempt_id, question_id, user_answer, is_correct, marks_awarded)
             VALUES ($1, $2, $3, true, $4)`,
            [attemptId, qRow.id, qRow.correct_answer, qRow.marks || 10]
          );
        }
      }
    }

    // 7. Seed Assignments & Submissions
    for (let i = 0; i < moesCourses.length; i++) {
      const course = moesCourses[i];
      const assignTitles = [
        'Surface Observation Station Siting & Quality Control Exercise',
        'Synoptic Monsoon Chart Interpretation & Weather Report',
        'Doppler Weather Radar Reflectivity & Velocity Calibration',
        'Climate Extremes Dataset Analysis & Anomaly Mapping',
        'Cyclone Warning Protocol & Emergency Communication Scenario'
      ];

      const aRes = await pool.query(
        `INSERT INTO assignments (course_id, title, description, due_date, max_score, created_by)
         VALUES ($1, $2, $3, NOW() + INTERVAL '14 days', 100.0, 2)
         RETURNING id`,
        [course.id, assignTitles[i % assignTitles.length], `Practical assessment exercise for ${course.title}`]
      );
      const assignmentId = aRes.rows[0].id;

      // Seed submissions
      await pool.query(
        `INSERT INTO assignment_submissions (assignment_id, user_id, submission_text, score, status, graded_at, graded_by)
         VALUES ($1, $2, 'Completed assignment exercise with detailed report.', 92.0, 'GRADED', NOW(), 2)
         ON CONFLICT DO NOTHING`,
        [assignmentId, mainLearnerId]
      );
    }

    console.log('[DB-DEMO] MOES/IMD demo dataset seeded successfully!');
  } catch (err) {
    console.error('[DB-DEMO] Error seeding demo data:', err);
  }
}

module.exports = { seedDemoData };
