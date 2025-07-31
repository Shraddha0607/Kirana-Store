//Async Handler is the Higher Order Funtion

const asyncHandler = (requestHandler) => {
      return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
      }
}

export default asyncHandler ;