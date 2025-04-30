import config from '../../config';
import catchAsync from '../../utils/catchAsync';

const index = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: `😎 SFF API is chilling on '${(config.NODE_ENV as string).toUpperCase()}' environment!`,
  });
});

export const HomeController = {
  index,
};
