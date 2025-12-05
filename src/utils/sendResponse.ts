import { Response } from "express";
import { TApiResponse, TApiResponseWithPayload } from "../types/apiResponse";

export const sendResponse = (res: Response, code: number, success: boolean, message: string, data?: any) => {
  if (!data) {
    return res.status(code).json({
      success: success,
      message: message,
    } as TApiResponse);
  }

  return res.status(code).json({
    success: success,
    message: message,
    data: data,
  } as TApiResponseWithPayload<any>);
};
