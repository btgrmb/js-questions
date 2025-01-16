import { expect, test } from 'vitest';
import { mockData } from './mock-data';
import { expectData } from './expect-data';
import { parseStruct } from './parse';

test('parseStruct', () => {
  expect(parseStruct(mockData)).toStrictEqual(expectData);
});
