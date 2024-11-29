import catchAsyncError from "../utils/catchAsyncError.js";
import CreateError from "./../utils/Errors.js";

const deleteOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new CreateError(`No document with this ID`, 404));
    }
    res.status(204).json({
      message: "deleted"
    });
  });
};

export default { deleteOne };
