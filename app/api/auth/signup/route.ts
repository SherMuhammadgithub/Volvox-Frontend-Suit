import { NextRequest, NextResponse } from 'next/server';

// Mock user storage - replace with actual database logic
const mockUsers: any[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user (in real app, hash password and save to database)
    const newUser = {
      id: String(mockUsers.length + 1),
      name: name.trim(),
      email,
      password // In real app, hash this password
    };

    mockUsers.push(newUser);

    // Generate mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    // Create response
    const response = NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

    // Set cookie for middleware
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}