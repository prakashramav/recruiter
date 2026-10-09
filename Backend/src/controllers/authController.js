import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
};
