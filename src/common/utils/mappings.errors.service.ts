import { ErrorModel, OutputModelErrors } from '../models/error.model';

export class MapingErrorsService {
  outputResponse(data: ErrorModel): OutputModelErrors {
    const { message, field } = data;
    return {
      errorsMessages: [
        {
          message,
          field,
        },
      ],
    };
  }
}
