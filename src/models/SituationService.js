import { Situation, SituationQuery } from './Situation';
import { cardArray } from '../data/cardData';

export class SituationService {
  getSituationByQuery(query, limit) {
    return this.filterSituations(this.getAllSituations(), query, limit);
  }

  filterSituations(situations, query, limit) {
    let out = [];
    if (query) {
      const sq = new SituationQuery(query);
      situations.forEach(sit => {
        if (sit.isMatch(sq)) {
          out.push(sit);
        }
      });
    }

    if (limit && out.length > limit) {
      out = out.slice(0, limit);
    }

    return out;
  }

  getSituationByPosition(posName, data, startIndex) {
    return data.map(ob => {
      return new Situation(ob[0], ob[startIndex], ob[startIndex + 1], posName);
    });
  }

  getAllSituations(cardArrayData) {
    if (!cardArrayData) {
      cardArrayData = cardArray;
    }

    try {
      let situations = [];
      situations = this.getSituationByPosition('E', cardArrayData, 3);
      situations = situations.concat(this.getSituationByPosition('M', cardArrayData, 1));
      situations = situations.concat(this.getSituationByPosition('L', cardArrayData, 5));
      situations = situations.concat(this.getSituationByPosition('S', cardArrayData, 7));
      situations = situations.concat(this.getSituationByPosition('B', cardArrayData, 9));
      return situations;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
