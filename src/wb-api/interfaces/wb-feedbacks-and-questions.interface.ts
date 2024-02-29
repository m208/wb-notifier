export interface WBFeedbacksAndQuestionsRequestParams {
  isAnswered: boolean;
  take: number;
  skip: number;
}

export interface WBFeedbacksAndQuestionsResponse {
  error: boolean;
  errorText: string;
  additionalErrors: null | Array<string>;
}
