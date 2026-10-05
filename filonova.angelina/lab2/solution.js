export function findMissingNumber(arr) {
  const n = arr.length + 1;

  const expectedSum = (n * (n + 1)) / 2;

  const actualSum = arr.reduce((sum, number) => sum + number, 0);

  return expectedSum - actualSum;
}
