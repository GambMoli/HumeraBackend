import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.ts';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword.toString()]
    );

    const user: User = newUser.rows[0];
    const { password: userPassword, ...userWithoutPassword } = user;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ message: 'User successfully registered', user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user: User = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const { password: userPassword, ...userWithoutPassword } = user;

    return res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
};
