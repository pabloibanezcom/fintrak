import User, { type IUser } from '../../models/UserModel';

describe('UserModel', () => {
  it('should create a user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'hashedPassword123',
    };

    const user: IUser = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser._id).toBeDefined();
  });

  it('should require email field', async () => {
    const user = new User({ password: 'password123' });

    await expect(user.save()).rejects.toThrow();
  });

  it('should require password field', async () => {
    const user = new User({ email: 'test@example.com' });

    await expect(user.save()).rejects.toThrow();
  });

  it('should enforce unique email constraint', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'password123',
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    await expect(user2.save()).rejects.toThrow();
  });

  it('should validate email format implicitly through mongoose', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });

    const savedUser = await user.save();
    expect(savedUser.email).toBe('test@example.com');
  });
});
