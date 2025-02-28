export interface IResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface IPagination {
  page: number
  limit: number
  totalPages: number
  totalDocs: number
}

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Adding the user property to the Request interface
      headers:{
        authorization?: string;  // Adding the authorization header to the Request interface
      }
    }
  }
}