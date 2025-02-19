import CRISES from 'src/data/crises';
import { Crisis } from 'src/domain/crisis/crisis';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';

export class CrisisFactory {
  static create(crisis: CRISIS_NAMES): Crisis {
    return new Crisis({
      ...CRISES[crisis],
    });
  }

  static fromJSON(data: ReturnType<Crisis['toJSON']>) {
    return new Crisis(data);
  }
}
