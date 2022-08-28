const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');

/**
  @desc   Fetch users
  @param  { page, limit }
  @method GET
  @route  /api/v1/users/
  @access Private
  @role   Admin
*/
exports.getAllUserHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,photo,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const users = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch users successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch users Successfully!',
    data: users,
  });
});

/**
  @desc   Fetch user by id
  @param  { id }
  @method GET
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.getUserByIdHandler = asyncHandler(async (req, res, _) => {
  const user = await User.findOne({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch user successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch user Successfully!',
    data: user,
  });
});

/**
  @desc   Update user by id
  @param  { id }
  @method PUT
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.updateUserHandler = asyncHandler(async (req, res, _) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    throw new NotFoundException('User not found!');
  }

  if (req.file) user.photo = req.file.filename;
  await user.save();

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated user successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated user Successfully!',
    data: user,
  });
});

/**
  @desc   Delete user by id
  @param  { id }
  @method DELETE
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.deleteUserHandler = asyncHandler(async (req, res, _) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    throw new NotFoundException('User not found!');
  }

  await User.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch user successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch user Successfully!',
    data: user,
  });
});
