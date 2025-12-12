import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/models/User';
import { IJWTPayload, UserRole } from '@/types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        role: UserRole;
        name: string;
        isActive: boolean;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'MISSING_TOKEN'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;

    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Add user to request object
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        error: 'INVALID_TOKEN'
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
        error: 'TOKEN_EXPIRED'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      error: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Authorization middleware to check user roles
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = authorize(UserRole.ADMIN);

/**
 * Middleware to check if user is customer
 */
export const requireCustomer = authorize(UserRole.CUSTOMER);

/**
 * Middleware to check if user is admin or customer (any authenticated user)
 */
export const requireAuth = authorize(UserRole.ADMIN, UserRole.CUSTOMER);

/**
 * Optional authentication middleware - does not require authentication but adds user if token is valid
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;
      const user = await User.findById(decoded.userId).select('-password');

      if (user && user.isActive) {
        req.user = {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          isActive: user.isActive
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Middleware to ensure user can only access their own resources
 */
export const requireOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      error: 'NOT_AUTHENTICATED'
    });
  }

  // Admin can access all resources
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }

  // Check if the requested resource belongs to the user
  const userId = req.params.userId || req.body.userId || req.query.userId;

  if (userId && userId !== req.user._id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.',
      error: 'RESOURCE_OWNERSHIP_REQUIRED'
    });
  }

  next();
};

/**
 * Extract JWT token from request headers
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  return null;
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: IJWTPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    issuer: 'evolution-gadget',
    audience: 'evolution-gadget-users'
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): IJWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as IJWTPayload;
};
