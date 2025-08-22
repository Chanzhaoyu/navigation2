import {
  ApiResponse,
  SuccessStatus,
  ErrorStatus,
} from '../interface/response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    status: SuccessStatus = SuccessStatus.SUCCESS,
  ): ApiResponse<T> {
    return {
      code: 1,
      data,
      message,
      status,
    };
  }

  static error<T = null>(
    message: string = 'Failed',
    status: ErrorStatus = ErrorStatus.INTERNAL_ERROR,
    data: T = null as T,
  ): ApiResponse<T> {
    return {
      code: 0,
      data,
      message,
      status,
    };
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number,
    message: string = 'Success',
  ): ApiResponse<{
    items: T[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    return this.success({
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      message,
    });
  }
}
