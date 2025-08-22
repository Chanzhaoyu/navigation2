import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ResponseUtil } from '../utils/response.util';
import { ApiResponse, SuccessStatus } from '../interface/response.interface';
import { RAW_RESPONSE } from '../decorators/raw-response.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const isRaw = this.reflector.get<boolean>(
      RAW_RESPONSE,
      context.getHandler(),
    );
    if (isRaw) {
      return next.handle() as unknown as Observable<ApiResponse<T>>;
    }

    return next.handle().pipe(
      map((data: T): ApiResponse<T> => {
        if (this.isApiResponse(data)) {
          return data;
        }

        // 根据 HTTP 方法自动生成消息
        const request = context.switchToHttp().getRequest();

        const isCreateOperation = request.method === 'POST';
        if (isCreateOperation) {
          return ResponseUtil.success(data, '创建成功', SuccessStatus.CREATED);
        }

        const isUpdateOperation = ['PUT', 'PATCH'].includes(request.method);
        if (isUpdateOperation) {
          return ResponseUtil.success(data, '更新成功', SuccessStatus.UPDATED);
        }

        const isDeleteOperation = request.method === 'DELETE';
        if (isDeleteOperation) {
          return ResponseUtil.success(data, '删除成功', SuccessStatus.DELETED);
        }

        return ResponseUtil.success(data);
      }),
    );
  }

  private isApiResponse<T>(data: T): data is T & ApiResponse<T> {
    return (
      data !== null &&
      data !== undefined &&
      typeof data === 'object' &&
      'code' in data &&
      'data' in data &&
      'message' in data &&
      'status' in data
    );
  }
}
