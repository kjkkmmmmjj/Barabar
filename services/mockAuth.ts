import { nanoid } from 'nanoid';

// Mock user storage
const users: Record<string, any> = {
  'user1': {
    id: 'user1',
    email: 'demo@example.com',
    password: 'password123',
    displayName: 'Demo User',
  },
};

export const mockAuth = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = Object.values(users).find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return userData;
  },
  
  signup: async (email: string, password: string, name: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (Object.values(users).some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const userId = nanoid();
    const newUser = {
      id: userId,
      email,
      password,
      displayName: name,
    };
    
    // Store user
    users[userId] = newUser;
    
    // Return user data (excluding password)
    const { password: _, ...userData } = newUser;
    return userData;
  },
  
  logout: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },
  
  updateProfile: async (userId: string, data: { displayName?: string }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    if (!users[userId]) {
      throw new Error('User not found');
    }
    
    // Update user data
    users[userId] = {
      ...users[userId],
      ...data,
    };
    
    // Return updated user data (excluding password)
    const { password: _, ...userData } = users[userId];
    return userData;
  },
};