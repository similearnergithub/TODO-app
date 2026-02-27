import express from 'express';
import axios from 'axios';
import Summary from '../models/Summary.js';
import Todo from '../models/Todo.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Generate summary using Groq
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;

    // Get today's completed tasks
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const completedTasks = await Todo.find({
      userId: req.userId,
      completed: true,
      updatedAt: { $gte: todayStart, $lte: todayEnd }
    });

    const tasksSnapshot = completedTasks.map((task) => ({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    }));

    if (completedTasks.length === 0) {
      return res.status(200).json({
        completedCount: 0,
        tasks: [],
        briefSummary: 'No tasks were completed today.',
        summary: 'No tasks were completed today.'
      });
    }

    const openingStyles = [
      'Start with a concise progress highlight.',
      'Start with an outcome-focused line.',
      'Start with a momentum-focused line.',
      'Start with a priority-balance observation.',
      'Start with a concise impact statement.'
    ];

    const styleIndex = (completedTasks.length + new Date().getDate()) % openingStyles.length;

    // Helper: simple local summary (no external API)
    const buildLocalSummary = () => {
      const fallbackTemplates = [
        `Strong progress today: you completed ${completedTasks.length} task(s) while maintaining focus across priorities.`,
        `Today's execution was steady with ${completedTasks.length} completed task(s) and clear priority coverage.`,
        `You closed ${completedTasks.length} task(s) today, showing good momentum and balanced attention to priorities.`,
        `A productive day overall: ${completedTasks.length} task(s) were completed with disciplined priority handling.`
      ];

      return fallbackTemplates[(completedTasks.length + new Date().getDay()) % fallbackTemplates.length];
    };

    let summary;
    let summarySource = 'fallback';

    if (!groqApiKey) {
      // Fallback when Groq is not configured
      summary = buildLocalSummary();
    } else {
      try {
        const tasksList = tasksSnapshot
          .map((task) => {
            const detail = task.description ? ` Description: ${task.description}` : '';
            return `- ${task.title} (Priority: ${task.priority}).${detail}`;
          })
          .join('\n');

        const prompt =
          `You are a productivity assistant.\n` +
          `The user completed the tasks below today:\n${tasksList}\n\n` +
          `${openingStyles[styleIndex]}\n` +
          `Write one brief professional summary in 2 sentences that combines overall progress, outcomes from the task descriptions, and priority balance.\n` +
          `Use varied wording and avoid starting with the same phrase each time.\n` +
          `Do not repeat the task list. Respond with summary text only.`;

        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 150
          },
          {
            headers: {
              Authorization: `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const groqSummary = response.data?.choices?.[0]?.message?.content?.trim();
        if (groqSummary) {
          summary = groqSummary;
          summarySource = 'groq';
        } else {
          summary = buildLocalSummary();
        }
      } catch (groqError) {
        console.error('Groq API Error:', groqError.response?.data || groqError.message);
        // Graceful fallback instead of failing the whole request
        summary = buildLocalSummary();
      }
    }

    const combinedSummary = `Completed ${completedTasks.length} task(s) today.`;

    // Save to database (both AI and fallback summaries)
    const summaryRecord = await Summary.create({
      userId: req.userId,
      summary: combinedSummary,
      completedCount: completedTasks.length,
      briefSummary: summary,
      tasksSnapshot,
      tasksCompleted: completedTasks.map(t => t._id)
    });

    res.status(200).json({
      completedCount: completedTasks.length,
      tasks: tasksSnapshot,
      briefSummary: summary,
      summarySource,
      summary: combinedSummary,
      savedId: summaryRecord._id
    });
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate summary', error: error.message });
  }
});

// Get summary history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summaries', error: error.message });
  }
});

export default router;
