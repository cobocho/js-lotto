const LOTTO_REWARD_CODE = Object.freeze({
  FIFTH: 'MATCH_3',
  FOURTH: 'MATCH_4',
  THIRD: 'MATCH_5',
  SECOND: 'MATCH_5_WITH_BONUS',
  FIRST: 'MATCH_6',
});

const LOTTO_REWARD = Object.freeze({
  [LOTTO_REWARD_CODE.FIFTH]: {
    matchedCount: 3,
    hasBonus: false,
    prize: 5_000,
  },
  [LOTTO_REWARD_CODE.FOURTH]: {
    matchedCount: 4,
    hasBonus: false,
    prize: 50_000,
  },
  [LOTTO_REWARD_CODE.THIRD]: {
    matchedCount: 5,
    hasBonus: false,
    prize: 1_500_000,
  },
  [LOTTO_REWARD_CODE.SECOND]: {
    matchedCount: 5,
    hasBonus: true,
    prize: 30_000_000,
  },
  [LOTTO_REWARD_CODE.FIRST]: {
    matchedCount: 6,
    hasBonus: false,
    prize: 2_000_000_000,
  },
});

const LOTTO_PRICE = 1_000;

const LOTTO_NUMBER_QUANTITY = 6;

const LOTTO_NUMBER_RANGE = Object.freeze({
  MIN: 1,
  MAX: 45,
});

const LOTTO_RETRY_CODE = Object.freeze({
  CONFIRM: 'y',
  REJECT: 'n',
});

export { LOTTO_REWARD_CODE, LOTTO_REWARD, LOTTO_PRICE, LOTTO_NUMBER_QUANTITY, LOTTO_NUMBER_RANGE, LOTTO_RETRY_CODE };
