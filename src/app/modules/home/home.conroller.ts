import catchAsync from '../../utils/catchAsync';

const index = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bike service API is running!',
  });
});

export const HomeController = {
  index,
};
