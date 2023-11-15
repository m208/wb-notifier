import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import { WbAPIOrdersResponse } from './interfaces/wb-orders-response.interface';
import { WbAPIContentResponse } from './interfaces/wb-product-response.interface';

@Injectable()
export class WbApiService {
  private readonly logger = new Logger(WbApiService.name);

  constructor(private readonly httpService: HttpService) {}

  setAuthHeaders() {
    return {
      Authorization: `Bearer ${process.env.WB_API_TOKEN}`,
    };
  }

  async getNewOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WbAPIOrdersResponse>(wbApiLinks.getOrders, {
          headers: this.setAuthHeaders(),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data.orders;
  }

  async getProductTitle(productCode: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<WbAPIContentResponse>(
          wbApiLinks.getProducts,
          { vendorCodes: [productCode] },
          { headers: this.setAuthHeaders() },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    const productName: string | undefined = data.data[0].characteristics
      .filter((el) => Object.keys(el).includes('Наименование'))
      .map((el) => Object.values(el))
      .flat()
      .pop();

    return productName;
  }
}
