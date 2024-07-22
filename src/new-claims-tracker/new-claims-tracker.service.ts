import { Injectable, Logger } from '@nestjs/common';
import { LINE_DIVIDER_TG, NEW_CLAIMS_MESSAGE } from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import {
  WBClaimDTO,
  WBClaimsRequestParams,
} from 'src/wb-api/interfaces/wb-claims.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

const requestClaimsParams: WBClaimsRequestParams = {
  is_archive: false,
};

@Injectable()
export class NewClaimsTrackerService {
  private readonly logger = new Logger(NewClaimsTrackerService.name);
  private handledClaims: Array<string> = [];
  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async requestNewClaims() {
    const claims = await this.getNewClaims();
    return `${NEW_CLAIMS_MESSAGE} ${claims.length}`;
  }

  async getNewClaims() {
    return await this.wbApiService.getClaimsList(requestClaimsParams);
  }

  async checkNewClaims() {
    const claims = await this.getNewClaims();

    if (claims.length > 0) {
      this.handleNewClaims(claims);
    }
  }

  async handleNewClaims(claims: Array<WBClaimDTO>) {
    for await (const claim of claims) {
      if (!this.handledClaims.includes(claim.id)) {
        try {
          this.tgSenderService.sendMessage(this.generateMessageContent(claim));
          this.handledClaims.push(claim.id);
          this.logger.log(`Message sent for a new claim`);
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }

  generateMessageContent(claim: WBClaimDTO, divider = LINE_DIVIDER_TG) {
    const lines = [
      `Новая заявка на возврат товара на Wildberries`,
      `Товар: ${claim.imt_name}`,
      `Комментарий: ${claim.user_comment}`,
    ];
    return lines.join(divider);
  }
}
