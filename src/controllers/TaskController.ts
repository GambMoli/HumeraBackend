import { Request, Response } from 'express';
import { db } from '../config/db';
import { Task } from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
  const { project_id, title, description, assignee } = req.body;

  if (!project_id || !title || !assignee) {
    return res.status(400).json({ message: 'Project ID, title, and assignee are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO tasks (project_id, title, description, assignee) VALUES ($1, $2, $3, $4) RETURNING *',
      [project_id, title, description || null, assignee]
    );

    const task: Task = result.rows[0];
    return res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating task' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM tasks WHERE project_id = $1';
    const params: any[] = [projectId];

    if (status && typeof status === 'string') {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    const tasks: Task[] = result.rows;
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['todo', 'in_progress', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be one of: todo, in_progress, done'
    });
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [status, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task: Task = result.rows[0];
    return res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task: Task = result.rows[0];
    return res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
};