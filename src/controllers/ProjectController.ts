import { Request, Response } from 'express';
import { db } from '../config/db';
import { Project } from '../models/Project';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const createProject = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO projects (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );

    const project: Project = result.rows[0];
    return res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating project' });
  }
};


export const getProjects = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    const projects: Project[] = result.rows;
    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching projects' });
  }
};
