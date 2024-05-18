import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";
import { IGenericErrorResponse } from "../interfaces/common";

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const error: IGenericErrorMessage[] = Object.values(err?.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation error",
    errorMessages: error,
  };
};

export default handleValidationError;
