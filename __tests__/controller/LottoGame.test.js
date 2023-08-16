import LottoGame from '../../src/js/controller/LottoGame.js';
import LottoMachine from '../../src/js/domain/LottoMachine.js';
import Lotto from '../../src/js/domain/Lotto.js';
import { DEFAULT_LOTTO_NUMBERS, LOTTO_REWARD_DUMMY, MATCHED_BONUS } from '../constants/lotto.js';
import { LOTTO_REWARD_CODE } from '../../src/js/constants/lotto-config.js';
import LottoInputView from '../../src/js/view/Lotto/LottoInputView.js';
import ERROR from '../../src/js/constants/error.js';

jest.mock('../../src/js/view/Lotto/LottoInputView.js');
jest.mock('../../src/js/domain/LottoMachine.js');

const logSpy = jest.spyOn(console, 'log');

const mockInput = ({ purchase, winningNumbers, bonus, returnedLottos }) => {
  LottoInputView.prototype.purchase.mockResolvedValue(purchase);
  LottoInputView.prototype.winningNumbers.mockResolvedValue(winningNumbers);
  LottoInputView.prototype.bonus.mockResolvedValue(bonus);
  LottoMachine.prototype.buy.mockReturnValue(returnedLottos);
};

describe('로또 구매 과정 테스트', () => {
  let lottoGame;

  beforeAll(() => {
    lottoGame = new LottoGame();
    process.exit = jest.fn();
    mockInput({
      purchase: '1000',
      winningNumbers: LOTTO_REWARD_DUMMY.SECOND,
      bonus: MATCHED_BONUS,
      returnedLottos: [new Lotto(DEFAULT_LOTTO_NUMBERS)],
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('로또를 1,000원에 한 장 구매한다', async () => {
    await lottoGame.buyLotto();

    expect(logSpy).toHaveBeenNthCalledWith(1, '1개를 구매했습니다.');
    expect(logSpy).toHaveBeenNthCalledWith(2, DEFAULT_LOTTO_NUMBERS);
    expect(lottoGame.recentPurchaseMoney).toBe(1000);
    expect(lottoGame.recentLottos).toEqual([new Lotto(DEFAULT_LOTTO_NUMBERS)]);
    expect(lottoGame.recentLottos.length).toBe(1);
  });

  it('당첨번호를 입력한다', async () => {
    await lottoGame.setWinningNumbers();

    expect(lottoGame.winningNumbers).toEqual(LOTTO_REWARD_DUMMY.SECOND);
  });

  it('보너스번호를 입력한다', async () => {
    await lottoGame.setBonus();

    expect(lottoGame.bonus).toBe(MATCHED_BONUS);
  });

  it('당첨 결과를 확인한다.', async () => {
    lottoGame.checkLottos();

    expect(lottoGame.result).toEqual({
      [LOTTO_REWARD_CODE.FIRST]: 0,
      [LOTTO_REWARD_CODE.SECOND]: 1,
      [LOTTO_REWARD_CODE.THIRD]: 0,
      [LOTTO_REWARD_CODE.FOURTH]: 0,
      [LOTTO_REWARD_CODE.FIFTH]: 0,
    });

    expect(logSpy).toHaveBeenNthCalledWith(3, '당첨 통계');
    expect(logSpy).toHaveBeenNthCalledWith(4, '--------------------');
    expect(logSpy).toHaveBeenNthCalledWith(5, '3개 일치 (5,000원) - 0개');
    expect(logSpy).toHaveBeenNthCalledWith(6, '4개 일치 (50,000원) - 0개');
    expect(logSpy).toHaveBeenNthCalledWith(7, '5개 일치 (1,500,000원) - 0개');
    expect(logSpy).toHaveBeenNthCalledWith(8, '5개 일치, 보너스 볼 일치 (30,000,000원) - 1개');
    expect(logSpy).toHaveBeenNthCalledWith(9, '6개 일치 (2,000,000,000원) - 0개');
  });

  it('전체 상금을 설정한다.', async () => {
    lottoGame.setTotalPrize();

    expect(lottoGame.totalPrize).toBe(30000000);
  });

  it('수익률을 확인한다.', async () => {
    lottoGame.setRateOfReturn();

    expect(lottoGame.rateOfReturn).toBe(3000000);
    expect(logSpy).toHaveBeenNthCalledWith(10, '총 수익률은 3,000,000%입니다.');
  });

  it('게임을 종료한다.', async () => {
    lottoGame.stopGame();

    expect(lottoGame.recentPurchaseMoney).toBe(0);
    expect(lottoGame.recentLottos).toEqual([]);
    expect(lottoGame.winningNumbers).toEqual([]);
    expect(lottoGame.bonus).toBe(null);
    expect(lottoGame.result).toBe(null);
    expect(lottoGame.totalPrize).toBe(0);
    expect(lottoGame.rateOfReturn).toBe(null);

    expect(process.exit).toHaveBeenCalled();
  });
});

describe('당첨 번호 예외 테스트', () => {
  beforeAll(() => {
    process.exit = jest.fn();
  });

  it('6개가 아닌 당첨 번호를 입력시 에러가 발생한다.', async () => {
    mockInput({
      purchase: '1000',
      winningNumbers: [1, 2, 3, 4, 5],
      bonus: MATCHED_BONUS,
      returnedLottos: [new Lotto(DEFAULT_LOTTO_NUMBERS)],
    });

    expect(async () => {
      const lottoGame = new LottoGame();
      await lottoGame.buyLotto();
      await lottoGame.setWinningNumbers();
    }).toThrow(ERROR.WINNING_NUMBERS.UNMATCHED_QUANTITY);
  });

  it.each([
    [1, 2, 3, 4, 5, 46],
    [0, 2, 3, 4, 5, 6],
    [-1, 2, 3, 4, 5, 6],
    ['한글', 2, 3, 4, 5, 6],
  ])('범위 외의 당첨 번호를 입력시 에러가 발생한다.', async (winningNumbers) => {
    mockInput({
      purchase: '1000',
      winningNumbers,
      bonus: MATCHED_BONUS,
      returnedLottos: [new Lotto(DEFAULT_LOTTO_NUMBERS)],
    });

    expect(async () => {
      const lottoGame = new LottoGame();
      await lottoGame.buyLotto();
      await lottoGame.setWinningNumbers();
    }).toThrow(ERROR.WINNING_NUMBERS.UNMATCHED_QUANTITY);
  });
});
