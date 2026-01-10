const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Payment = require('../models/Payment');
const Coupon = require('../models/Coupon');
const { notifyCouponAvailable, notifyUser } = require('../utils/notificationService');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {

    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRestaurants = await Restaurant.countDocuments({ isApproved: true });
    const totalOrders = await Order.countDocuments();
    const pendingApprovals = await Restaurant.countDocuments({ isApproved: false });

    // Get revenue stats
    const revenueStats = await Payment.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('userId', 'name')
      .populate('restaurantId', 'name');

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    successResponse(res, 200, 'Dashboard stats retrieved', {
      overview: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        pendingApprovals,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        totalTransactions: revenueStats[0]?.totalTransactions || 0
      },
      ordersByStatus,
      recentOrders,
      monthlyRevenue
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get dashboard stats', error.message);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    successResponse(res, 200, 'Users retrieved successfully', {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get users', error.message);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    successResponse(res, 200, 'Orders retrieved successfully', {
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get orders', error.message);
  }
};

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private (Admin)
exports.getAllRestaurants = async (req, res) => {
  try {
    const { isApproved, isActive } = req.query;
    let query = {};

    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const restaurants = await Restaurant.find(query)
      .populate('ownerId', 'name email phone')
      .sort('-createdAt');

    successResponse(res, 200, 'Restaurants retrieved successfully', {
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get restaurants', error.message);
  }
};

// @desc    Approve/reject restaurant
// @route   PATCH /api/admin/restaurants/:id/approve
// @access  Private (Admin)
exports.approveRestaurant = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    successResponse(res, 200, `Restaurant ${isApproved ? 'approved' : 'rejected'}`, { restaurant });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update restaurant status', error.message);
  }
};

// @desc    Block/unblock user
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
exports.blockUser = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    successResponse(res, 200, `User ${isActive ? 'unblocked' : 'blocked'}`, { user });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update user status', error.message);
  }
};

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validFrom,
      validTill,
      usageLimit,
      applicableRestaurants,
      userSpecific,
      applicableUsers,
      autoApply
    } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      validFrom,
      validTill,
      usageLimit,
      applicableRestaurants,
      userSpecific: userSpecific || false,
      applicableUsers: applicableUsers || [],
      autoApply: autoApply || false,
      createdBy: req.user._id
    });

    // Notify users about new coupon
    if (userSpecific && applicableUsers && applicableUsers.length > 0) {
      await notifyCouponAvailable(applicableUsers, coupon);
    } else if (!userSpecific) {
      // Notify all users
      const allUsers = await User.find({ role: 'user', isActive: true }).select('_id');
      const userIds = allUsers.map(u => u._id);
      await notifyCouponAvailable(userIds, coupon);
    }

    successResponse(res, 201, 'Coupon created successfully', { coupon });
  } catch (error) {
    errorResponse(res, 500, 'Failed to create coupon', error.message);
  }
};

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status === 'active') {
      filter.isActive = true;
      filter.validTill = { $gte: new Date() };
    } else if (status === 'expired') {
      filter.validTill = { $lt: new Date() };
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const coupons = await Coupon.find(filter)
      .populate('createdBy', 'name email')
      .populate('applicableRestaurants', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coupon.countDocuments(filter);

    successResponse(res, 200, 'Coupons fetched successfully', {
      coupons,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to fetch coupons', error.message);
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private (Admin)
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found');
    }

    successResponse(res, 200, 'Coupon updated successfully', { coupon });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update coupon', error.message);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found');
    }

    successResponse(res, 200, 'Coupon deleted successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to delete coupon', error.message);
  }
};