import Lotto from '../src/js/domain/Lotto.js';

describe('로또 테스트', () => {
  it('로또는 여섯개의 숫자로 이루어진 배열을 매개변수로 받으며 그 값을 필드에 소유한다.', () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);

    expect(lotto.numbers.length).toBe(6);
  });

  it.each([
    [[1, 2, 3, 4, 5, 6], 6],
    [[1, 2, 3, 4, 5, 9], 5],
    [[1, 2, 3, 4, 9, 9], 4],
    [[1, 2, 3, 9, 9, 9], 3],
    [[1, 2, 9, 9, 9, 9], 2],
    [[1, 9, 9, 9, 9, 9], 1],
    [[9, 9, 9, 9, 9, 9], 0],
  ])('로또는 입력받은 배열과 비교하여 몇개가 동일한지 알 수 있다.', (...input) => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);

    expect(lotto.compare([...input][0])).toBe([...input][1]);
  });
});
