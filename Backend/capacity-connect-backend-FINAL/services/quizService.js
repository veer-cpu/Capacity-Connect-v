const pool = require('../config/db');

class QuizService {
  // CREATE QUIZ
  async createQuiz({
    courseId,
    moduleId,
    title,
    description,
    passingScore,
    totalMarks,
    timeLimitMinutes,
    userId,
    userRole
  }) {
    if (!['TRAINER', 'ADMIN'].includes(userRole)) {
      throw new Error('Only trainer or admin can create quizzes');
    }

    const result = await pool.query(
      `INSERT INTO quizzes
       (course_id, module_id, title, description, passing_score, total_marks, time_limit_minutes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        courseId,
        moduleId || null,
        title,
        description || null,
        passingScore || 60,
        totalMarks || 100,
        timeLimitMinutes || 30,
        userId
      ]
    );

    return result.rows[0];
  }

  // ADD QUESTION
  async addQuestion({
    quizId,
    questionText,
    questionType,
    options,
    correctAnswer,
    marks,
    orderIndex,
    userId,
    userRole
  }) {
    if (!['TRAINER', 'ADMIN'].includes(userRole)) {
      throw new Error('Only trainer or admin can add questions');
    }

    const formattedOptions =
      typeof options === 'object' ? JSON.stringify(options) : options;

    const result = await pool.query(
      `INSERT INTO quiz_questions
       (
         quiz_id,
         question_text,
         question_type,
         options,
         correct_answer,
         marks,
         order_index
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        quizId,
        questionText,
        questionType || 'MULTIPLE_CHOICE',
        formattedOptions,
        correctAnswer,
        marks || 10,
        orderIndex || 1
      ]
    );

    return result.rows[0];
  }

  // GET ALL QUIZZES
  async getQuizzes() {
    const result = await pool.query(
      `SELECT
         q.*,
         c.title AS course_title,
         m.title AS module_title
       FROM quizzes q
       LEFT JOIN courses c ON c.id = q.course_id
       LEFT JOIN modules m ON m.id = q.module_id
       ORDER BY q.id ASC`
    );
    return result.rows;
  }

  // GET QUIZ
  async getQuiz(quizId) {
    const result = await pool.query(
      `SELECT
         q.*,
         c.title AS course_title,
         m.title AS module_title
       FROM quizzes q
       LEFT JOIN courses c ON c.id = q.course_id
       LEFT JOIN modules m ON m.id = q.module_id
       WHERE q.id = $1`,
      [quizId]
    );

    if (result.rows.length === 0) {
      throw new Error('Quiz not found');
    }

    return result.rows[0];
  }

  // GET QUESTIONS
  async getQuizQuestions(quizId, isTrainerOrAdmin = false) {
    const selectFields = isTrainerOrAdmin
      ? 'id, quiz_id, question_text, question_type, options, correct_answer, marks, order_index'
      : 'id, quiz_id, question_text, question_type, options, marks, order_index';

    const result = await pool.query(
      `SELECT ${selectFields}
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY order_index ASC, id ASC`,
      [quizId]
    );

    return result.rows.map((q) => {
      let parsedOptions = q.options;
      if (typeof parsedOptions === 'string') {
        try {
          parsedOptions = JSON.parse(parsedOptions);
        } catch (e) {
          parsedOptions = [parsedOptions];
        }
      }
      return {
        ...q,
        options: parsedOptions
      };
    });
  }

  // START QUIZ ATTEMPT
  async startQuizAttempt({ quizId, userId }) {
    const quizResult = await pool.query(
      `SELECT id, passing_score FROM quizzes WHERE id = $1`,
      [quizId]
    );

    if (quizResult.rows.length === 0) {
      throw new Error('Quiz not found');
    }

    // Check enrollment using user_id
    const enrollmentResult = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE course_id = (
         SELECT course_id
         FROM quizzes
         WHERE id = $1
       )
       AND user_id = $2
       LIMIT 1`,
      [quizId, userId]
    );

    if (enrollmentResult.rows.length === 0) {
      throw new Error('You are not enrolled in this course');
    }

    const attemptResult = await pool.query(
      `INSERT INTO quiz_attempts
       (
         quiz_id,
         user_id,
         score,
         percentage,
         passed,
         status
       )
       VALUES ($1, $2, 0, 0, false, 'IN_PROGRESS')
       RETURNING *`,
      [quizId, userId]
    );

    return attemptResult.rows[0];
  }

  // SUBMIT QUIZ ATTEMPT
  async submitQuizAttempt({ attemptId, answers, userId }) {
    // Get attempt
    const attemptResult = await pool.query(
      `SELECT
         qa.*,
         q.passing_score
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.id = $1
       AND qa.user_id = $2`,
      [attemptId, userId]
    );

    if (attemptResult.rows.length === 0) {
      throw new Error('Quiz attempt not found');
    }

    const attempt = attemptResult.rows[0];

    // Get all questions
    const questionsResult = await pool.query(
      `SELECT id, question_text, options, correct_answer, marks
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY order_index ASC, id ASC`,
      [attempt.quiz_id]
    );

    const questions = questionsResult.rows;

    let score = 0;
    let totalMarks = 0;

    // Delete previous answers if re-submitting
    await pool.query(
      `DELETE FROM quiz_attempt_answers WHERE attempt_id = $1`,
      [attemptId]
    );

    const submittedAnswers = Array.isArray(answers) ? answers : [];

    for (const question of questions) {
      const qMarks = Number(question.marks) || 0;
      totalMarks += qMarks;

      const userAnsObj = submittedAnswers.find(
        (a) => Number(a.questionId || a.question_id) === Number(question.id)
      );

      const userAnswer = userAnsObj
        ? (userAnsObj.selectedOption ?? userAnsObj.user_answer ?? userAnsObj.selectedAnswer ?? '')
        : null;

      let isCorrect = false;
      if (userAnswer !== null && userAnswer !== undefined) {
        const cleanUser = String(userAnswer).trim().toLowerCase();
        const cleanCorrect = String(question.correct_answer).trim().toLowerCase();
        isCorrect = cleanUser === cleanCorrect;
      }

      const marksAwarded = isCorrect ? qMarks : 0;
      score += marksAwarded;

      await pool.query(
        `INSERT INTO quiz_attempt_answers
         (
           attempt_id,
           question_id,
           user_answer,
           is_correct,
           marks_awarded
         )
         VALUES ($1, $2, $3, $4, $5)`,
        [
          attemptId,
          question.id,
          userAnswer ? String(userAnswer) : null,
          isCorrect,
          marksAwarded
        ]
      );
    }

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= Number(attempt.passing_score);

    // Update attempt
    await pool.query(
      `UPDATE quiz_attempts
       SET
         score = $1,
         percentage = $2,
         passed = $3,
         status = 'SUBMITTED',
         submitted_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [score, percentage, passed, attemptId]
    );

    return {
      attemptId,
      quizId: attempt.quiz_id,
      score,
      totalMarks,
      percentage: Number(percentage.toFixed(2)),
      passingScore: Number(attempt.passing_score),
      passed
    };
  }

  // GET ATTEMPT RESULT
  async getAttemptResult(attemptId, userId, userRole) {
    let queryStr;
    let params;

    if (['ADMIN', 'TRAINER'].includes(userRole)) {
      queryStr = `
        SELECT
          qa.*,
          q.title AS quiz_title,
          q.passing_score
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        WHERE qa.id = $1
      `;
      params = [attemptId];
    } else {
      queryStr = `
        SELECT
          qa.*,
          q.title AS quiz_title,
          q.passing_score
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        WHERE qa.id = $1
        AND qa.user_id = $2
      `;
      params = [attemptId, userId];
    }

    const attemptResult = await pool.query(queryStr, params);

    if (attemptResult.rows.length === 0) {
      throw new Error('Attempt not found');
    }

    const attempt = attemptResult.rows[0];

    const answersResult = await pool.query(
      `SELECT
         qaa.id,
         qaa.question_id,
         qaa.user_answer,
         qaa.is_correct,
         qaa.marks_awarded,
         qq.question_text,
         qq.options,
         qq.correct_answer,
         qq.marks
       FROM quiz_attempt_answers qaa
       JOIN quiz_questions qq ON qq.id = qaa.question_id
       WHERE qaa.attempt_id = $1
       ORDER BY qq.order_index ASC, qq.id ASC`,
      [attemptId]
    );

    const parsedAnswers = answersResult.rows.map((row) => {
      let parsedOptions = row.options;
      if (typeof parsedOptions === 'string') {
        try {
          parsedOptions = JSON.parse(parsedOptions);
        } catch (e) {
          parsedOptions = [parsedOptions];
        }
      }
      return {
        ...row,
        options: parsedOptions
      };
    });

    return {
      attempt,
      answers: parsedAnswers
    };
  }

  // GET QUIZ ATTEMPTS FOR QUIZ
  async getQuizAttempts(quizId) {
    const result = await pool.query(
      `SELECT qa.*, u.name AS user_name, u.email AS user_email
       FROM quiz_attempts qa
       JOIN users u ON u.id = qa.user_id
       WHERE qa.quiz_id = $1
       ORDER BY qa.created_at DESC`,
      [quizId]
    );
    return result.rows;
  }

  // UPDATE QUIZ
  async updateQuiz(quizId, { title, description, courseId, moduleId, passingScore, timeLimitMinutes }, userId, userRole) {
    if (!['TRAINER', 'ADMIN'].includes(userRole)) {
      throw new Error('Only trainer or admin can update quizzes');
    }
    const result = await pool.query(
      `UPDATE quizzes
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           course_id = COALESCE($3, course_id),
           module_id = COALESCE($4, module_id),
           passing_score = COALESCE($5, passing_score),
           time_limit_minutes = COALESCE($6, time_limit_minutes),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, courseId, moduleId, passingScore, timeLimitMinutes, quizId]
    );
    return result.rows[0];
  }
}

module.exports = new QuizService();