import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { type IUser } from '../models/UserModel';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials not configured. Google authentication will not be available.');
}

// Serialize user for session
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as IUser)._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

// Google OAuth Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, return user
            return done(null, user);
          }

          // Check if user exists with same email but different auth provider
          const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });

          if (existingUser) {
            // Link Google account to existing email account
            existingUser.googleId = profile.id;
            existingUser.authProvider = 'google';
            existingUser.profilePicture = profile.photos?.[0]?.value;
            existingUser.name = profile.name?.givenName;
            existingUser.lastName = profile.name?.familyName;
            await existingUser.save();
            return done(null, existingUser);
          }

          // Create new user
          const newUser = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profilePicture: profile.photos?.[0]?.value,
            authProvider: 'google',
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}

export default passport;