import { Request, Response } from 'express';
import { Gadget } from '@/models/Gadget';
import { AppError, asyncHandler } from '@/middleware/errorHandler';
import { GadgetCategory, IGadgetFilters, ISortOptions } from '@/types';

/**
 * Get all gadgets with filtering, sorting, and pagination
 */
export const getAllGadgets = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const search = req.query.search as string;
  const category = req.query.category as GadgetCategory;
  const brand = req.query.brand as string;
  const minPrice = parseFloat(req.query.minPrice as string);
  const maxPrice = parseFloat(req.query.maxPrice as string);
  const minRating = parseFloat(req.query.minRating as string);
  const inStock = req.query.inStock as string;
  const sortBy = req.query.sortBy as string || 'createdAt';
  const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

  // Build query
  const query: any = { isActive: true };

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Filters
  if (category) query.category = category;
  if (brand) query.brand = new RegExp(brand, 'i');
  if (!isNaN(minPrice)) query.price = { ...query.price, $gte: minPrice };
  if (!isNaN(maxPrice)) query.price = { ...query.price, $lte: maxPrice };
  if (!isNaN(minRating)) query.averageRating = { $gte: minRating };
  if (inStock === 'true') query.stock = { $gt: 0 };

  // Sorting
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [gadgets, total] = await Promise.all([
    Gadget.find(query).skip(skip).limit(limit).sort(sort),
    Gadget.countDocuments(query)
  ]);

  res.json({
    success: true,
    message: 'Gadgets retrieved successfully',
    data: gadgets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get single gadget by ID
 */
export const getGadgetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const gadget = await Gadget.findById(id);

  if (!gadget) {
    throw new AppError('Gadget not found', 404, 'GADGET_NOT_FOUND');
  }

  if (!gadget.isActive) {
    throw new AppError('Gadget is not available', 404, 'GADGET_UNAVAILABLE');
  }

  res.json({
    success: true,
    message: 'Gadget retrieved successfully',
    data: gadget
  });
});

/**
 * Get featured gadgets
 */
export const getFeaturedGadgets = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;

  const gadgets = await Gadget.find({ 
    isActive: true, 
    averageRating: { $gte: 4 }, 
    stock: { $gt: 0 } 
  })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);

  res.json({
    success: true,
    message: 'Featured gadgets retrieved successfully',
    data: gadgets
  });
});

/**
 * Get gadgets by category
 */
export const getGadgetsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  if (!Object.values(GadgetCategory).includes(category as GadgetCategory)) {
    throw new AppError('Invalid category', 400, 'INVALID_CATEGORY');
  }

  const skip = (page - 1) * limit;
  const [gadgets, total] = await Promise.all([
    Gadget.find({ category, isActive: true }).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Gadget.countDocuments({ category, isActive: true })
  ]);

  res.json({
    success: true,
    message: `${category} gadgets retrieved successfully`,
    data: gadgets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Search gadgets
 */
export const searchGadgets = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  if (!q || typeof q !== 'string') {
    throw new AppError('Search query is required', 400, 'SEARCH_QUERY_REQUIRED');
  }

  const searchQuery = {
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ]
  };

  const skip = (page - 1) * limit;
  const [gadgets, total] = await Promise.all([
    Gadget.find(searchQuery).skip(skip).limit(limit).sort({ averageRating: -1 }),
    Gadget.countDocuments(searchQuery)
  ]);

  res.json({
    success: true,
    message: 'Search results retrieved successfully',
    data: gadgets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Admin: Create new gadget
 */
export const createGadget = asyncHandler(async (req: Request, res: Response) => {
  const gadgetData = req.body;

  const gadget = await Gadget.create(gadgetData);

  res.status(201).json({
    success: true,
    message: 'Gadget created successfully',
    data: gadget
  });
});

/**
 * Admin: Update gadget
 */
export const updateGadget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const gadget = await Gadget.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!gadget) {
    throw new AppError('Gadget not found', 404, 'GADGET_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Gadget updated successfully',
    data: gadget
  });
});

/**
 * Admin: Delete gadget (soft delete)
 */
export const deleteGadget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const gadget = await Gadget.findByIdAndUpdate(id, { isActive: false }, { new: true });

  if (!gadget) {
    throw new AppError('Gadget not found', 404, 'GADGET_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Gadget deleted successfully',
    data: gadget
  });
});

/**
 * Admin: Permanently delete gadget
 */
export const permanentDeleteGadget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const gadget = await Gadget.findByIdAndDelete(id);

  if (!gadget) {
    throw new AppError('Gadget not found', 404, 'GADGET_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Gadget permanently deleted successfully'
  });
});

/**
 * Admin: Get all gadgets (including inactive)
 */
export const getAllGadgetsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const search = req.query.search as string;
  const category = req.query.category as GadgetCategory;
  const isActive = req.query.isActive as string;

  // Build query
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [gadgets, total] = await Promise.all([
    Gadget.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Gadget.countDocuments(query)
  ]);

  res.json({
    success: true,
    message: 'All gadgets retrieved successfully',
    data: gadgets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get gadget statistics
 */
export const getGadgetStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Gadget.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        averageRating: { $avg: '$averageRating' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const totalGadgets = await Gadget.countDocuments({ isActive: true });
  const totalBrands = await Gadget.distinct('brand', { isActive: true });

  res.json({
    success: true,
    message: 'Gadget statistics retrieved successfully',
    data: {
      totalGadgets,
      totalBrands: totalBrands.length,
      categoryStats: stats
    }
  });
});
