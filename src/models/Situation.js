export class Situation {
  constructor(face, unraisedPot, raisedPot, pos) {
    this.face = face;
    this.card1 = face.substring(0, 1).toUpperCase();
    this.card2 = face.substring(1, 2).toUpperCase();
    this.unraisedPot = unraisedPot;
    this.raisedPot = raisedPot;
    this.position = pos;
    this.suited = face.substring(2, 3).toUpperCase() === 'S' ? 'suited' : 'unsuited';
    this.isSuited = face.substring(2, 3).toUpperCase() === 'S';
    this.same = this.card1 === this.card2;
    this.showDiffCards = this.same || !this.suited;
    this.positionAbbr = pos.substring(0, 1).toUpperCase();
    this.hasNumber = !(isNaN(this.card1) && isNaN(this.card2));
    this.positionDisplay = '';
    this.show = false;
    this.wildCardMatch = false;
    this.isExactMatchFlag = false;

    switch (this.position) {
      case 'E':
        this.positionDisplay = 'Early';
        break;
      case 'M':
        this.positionDisplay = 'Middle';
        break;
      case 'L':
        this.positionDisplay = 'Late';
        break;
      case 'B':
        this.positionDisplay = 'Big Blind';
        break;
      default:
        this.positionDisplay = 'Small Blind';
    }
  }

  isMatch(situationQuery) {
    const isWildCardMatch = this.isWildCardMatch(
      situationQuery.card1, 
      situationQuery.card2, 
      situationQuery.position
    );

    const isExactMatch = this.isExactMatch(
      situationQuery.card1, 
      situationQuery.card2, 
      situationQuery.position
    );

    return isExactMatch || isWildCardMatch;
  }

  exactMatch(card1, card2) {
    return (card1 === this.card1) && (card2 === this.card2);
  }

  wildcardMatch(card1, card2) {
    let isMatchWIthWildcard = false;
    if (!isNaN(card1) && ((this.card1 === 'Z') || (this.card2 === 'Z'))) {
      if (this.card1 === card2 || this.card2 === card2) {
        isMatchWIthWildcard = true;
      }
    }

    if (!card1) {
      if (this.card1 === card2 || this.card2 === card2) {
        isMatchWIthWildcard = true;
      }
    }

    return isMatchWIthWildcard;
  }

  isWildCardMatch(card1, card2, position) {
    return (!position || this.position === position) && (
      this.wildcardMatch(card1, card2) || this.wildcardMatch(card2, card1)
    );
  }

  isExactMatch(card1, card2, position) {
    return (!position || this.position === position) && (
      this.exactMatch(card1, card2) || this.exactMatch(card2, card1)
    );
  }
}

export class SituationQuery {
  constructor(query) {
    this.position = '';
    const one = query.toUpperCase().substring(0, 1);
    const two = query.toUpperCase().substring(1, 2);
    const three = query.toUpperCase().substring(2, 3);

    if (this.isValidPosition(one)) {
      this.position = one;
      this.card1 = two;
      this.card2 = three;
    } else {
      this.position = '';
      this.card1 = one;
      this.card2 = two;
    }
  }

  isValidPosition(letter) {
    return 'EMLBS'.indexOf(letter) !== -1;
  }
}
