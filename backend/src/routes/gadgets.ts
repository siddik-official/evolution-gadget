import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as gadgetController from '@/controllers/gadgetController';
import { authenticate, requireAdmin, optionalAuth } from '@/middleware/auth';
import { GadgetCategory } from '@/types';

const router = Router();

// Validation rules
const gadgetValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .isIn(Object.values(GadgetCategory))
    .withMessage('Invalid category'),
  body('brand')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Brand must be between 1 and 50 characters'),
  body('model')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Model must be between 1 and 50 characters'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  body('images.*')
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('specifications')
    .optional()
    .isArray()
    .withMessage('Specifications must be an array'),
  body('specifications.*.key')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specification key is required'),
  body('specifications.*.value')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specification value is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid gadget ID')
];

const categoryValidation = [
  param('category')
    .isIn(Object.values(GadgetCategory))
    .withMessage('Invalid category')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const searchValidation = [
  query('q')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query is required')
];

// Public routes
router.get('/', paginationValidation, gadgetController.getAllGadgets);
router.get('/featured', gadgetController.getFeaturedGadgets);
router.get('/search', searchValidation, paginationValidation, gadgetController.searchGadgets);
router.get('/category/:category', categoryValidation, paginationValidation, gadgetController.getGadgetsByCategory);
router.get('/stats', gadgetController.getGadgetStats);
router.get('/:id', idValidation, gadgetController.getGadgetById);

// Admin routes
router.use('/admin', authenticate, requireAdmin);

router.get('/admin/all', paginationValidation, gadgetController.getAllGadgetsAdmin);
router.post('/admin', gadgetValidation, gadgetController.createGadget);
router.put('/admin/:id', idValidation, gadgetValidation, gadgetController.updateGadget);
router.delete('/admin/:id', idValidation, gadgetController.deleteGadget);
router.delete('/admin/:id/permanent', idValidation, gadgetController.permanentDeleteGadget);

export default router;
