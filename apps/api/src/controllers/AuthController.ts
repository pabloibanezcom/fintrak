import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/UserModel';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null;

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      authProvider: 'email',
    });

    res.status(201).json({ id: user._id, email: user.email });
  } catch (_err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if user is trying to login with password for Google account
    if (user.authProvider === 'google') {
      return res
        .status(401)
        .json({ error: 'Please use Google Sign-In for this account' });
    }

    if (!user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  } catch (_err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Google OAuth callback handler
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ error: 'Google authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // For mobile app, we'll redirect with token as query parameter
    // In production, you might want to use a more secure method
    res.redirect(
      `${process.env.MOBILE_APP_URL || 'exp://localhost:8081'}?token=${token}`
    );
  } catch (_err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Google token verification for mobile app
export const googleTokenAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!googleClient) {
    return res
      .status(500)
      .json({ error: 'Google authentication not configured' });
  }

  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const {
      sub: googleId,
      email,
      name,
      given_name,
      family_name,
      picture,
    } = payload;

    // Check if user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email but different auth provider
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.authProvider === 'email') {
        // Link Google account to existing email account
        existingUser.googleId = googleId;
        existingUser.profilePicture = picture;
        existingUser.name = given_name;
        existingUser.lastName = family_name;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = await User.create({
          googleId,
          email,
          name: given_name,
          lastName: family_name,
          profilePicture: picture,
          authProvider: 'google',
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Google token verification failed:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};
