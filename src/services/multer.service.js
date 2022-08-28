const multer = require('multer');
const sharp = require('sharp');

const { ErrorMessage } = require('../constants');
const { BadRequestException } = require('../errors');
const asyncHandler = require('../middleware/async-handler');

const multerStorage = multer.memoryStorage();

const multerFilter = (_, file, cb) => {
  if (file?.mimetype?.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new BadRequestException(ErrorMessage.ONLY_IMAGES_ALLOWED), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = asyncHandler(async (req, _, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`../public/img/users/${req.file.filename}`);

  return next();
});

module.exports = { uploadUserPhoto, resizeUserPhoto };
