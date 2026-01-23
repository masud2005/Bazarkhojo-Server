import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { success: boolean; statusCode: number; message: string } {
    return {
      success: true,
      statusCode: 200,
      message: 'API is running successfully',
    };
  }
}
