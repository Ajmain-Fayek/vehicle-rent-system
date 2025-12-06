import { Response } from "express";
import { TApiResponse, TApiResponseWithPayload } from "../types/index";

/**
 * sendResponse return a json response.
 * @param res - response object
 * @param code - status code
 * @param success - true | false
 * @param message - (sensitive) success true - <message: string> | success false - [ <message: string>, <errors: string> ]
 * @param data - send the payload
 * @returns - json response
 */

export const sendResponse = (
  res: Response,
  code: number,
  success: boolean,
  message: string | [message: string, errors: string],
  data?: any
) => {
  if (!success) {
    return res.status(code).json({
      success: false,
      message: message[0],
      errors: message[1],
    } as TApiResponse);
  }

  if (!data) {
    return res.status(code).json({
      success: true,
      message: message,
    } as TApiResponse);
  }

  return res.status(code).json({
    success: true,
    message: message,
    data: data,
  } as TApiResponseWithPayload<any>);
};
