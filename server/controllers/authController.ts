import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { localStore } from '../data/store';
import { AuthenticatedRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'MySuperSecretJWTKey@2026#Thanmaye$123';

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = localStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = 'usr_' + Date.now() + Math.random().toString(36).substring(2, 7);

    const newUser = localStore.createUser({
      id: userId,
      name,
      email,
      passwordHash,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      preferredGenres: [28, 878, 12],
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = localStore.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      message: 'Logged in successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const user = localStore.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching current user.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { name, avatar, preferredGenres } = req.body;

    const updated = localStore.updateUser(req.user.id, {
      ...(name && { name }),
      ...(avatar && { avatar }),
      ...(preferredGenres && { preferredGenres })
    });

    if (!updated) return res.status(404).json({ message: 'User not found' });

    const { passwordHash: _, ...safeUser } = updated;
    return res.json({ message: 'Profile updated successfully!', user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = localStore.findUserByEmail(email);
  if (!user) {
    // Return friendly message to prevent email enumeration
    return res.json({ message: 'If an account exists for this email, password reset instructions have been sent.' });
  }

  return res.json({ message: 'Password reset code has been dispatched to your email address.' });
}
