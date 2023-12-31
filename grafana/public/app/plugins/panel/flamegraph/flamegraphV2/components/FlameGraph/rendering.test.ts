import { createDataFrame } from '@grafana/data';

import { FlameGraphDataContainer, LevelItem } from './dataTransform';
import { getRectDimensionsForLevel } from './rendering';

function makeDataFrame(fields: Record<string, Array<number | string>>) {
  return createDataFrame({
    fields: Object.keys(fields).map((key) => ({
      name: key,
      values: fields[key],
    })),
  });
}

describe('getRectDimensionsForLevel', () => {
  it('should render a single item', () => {
    const level: LevelItem[] = [{ start: 0, itemIndexes: [0], children: [], value: 100 }];
    const container = new FlameGraphDataContainer(makeDataFrame({ value: [100], level: [1], label: ['1'], self: [0] }));
    const result = getRectDimensionsForLevel(container, level, 1, 100, 0, 10);
    expect(result).toEqual([
      {
        width: 999,
        height: 22,
        itemIndex: 0,
        x: 0,
        y: 22,
        collapsed: false,
        ticks: 100,
        label: '1',
        unitLabel: '100',
      },
    ]);
  });

  it('should render a multiple items', () => {
    const level: LevelItem[] = [
      { start: 0, itemIndexes: [0], children: [], value: 100 },
      { start: 100, itemIndexes: [1], children: [], value: 50 },
      { start: 150, itemIndexes: [2], children: [], value: 50 },
    ];
    const container = new FlameGraphDataContainer(
      makeDataFrame({ value: [100, 50, 50], level: [2, 2, 2], label: ['1', '2', '3'], self: [0, 0, 0] })
    );
    const result = getRectDimensionsForLevel(container, level, 2, 100, 0, 10);
    expect(result).toEqual([
      { width: 999, height: 22, x: 0, y: 44, collapsed: false, ticks: 100, label: '1', unitLabel: '100', itemIndex: 0 },
      {
        width: 499,
        height: 22,
        x: 1000,
        y: 44,
        collapsed: false,
        ticks: 50,
        label: '2',
        unitLabel: '50',
        itemIndex: 1,
      },
      {
        width: 499,
        height: 22,
        x: 1500,
        y: 44,
        collapsed: false,
        ticks: 50,
        label: '3',
        unitLabel: '50',
        itemIndex: 2,
      },
    ]);
  });

  it('should render a collapsed items', () => {
    const level: LevelItem[] = [
      { start: 0, itemIndexes: [0], children: [], value: 100 },
      { start: 100, itemIndexes: [1], children: [], value: 2 },
      { start: 102, itemIndexes: [2], children: [], value: 1 },
    ];
    const container = new FlameGraphDataContainer(
      makeDataFrame({ value: [100, 2, 1], level: [2, 2, 2], label: ['1', '2', '3'], self: [0, 0, 0] })
    );
    const result = getRectDimensionsForLevel(container, level, 2, 100, 0, 1);
    expect(result).toEqual([
      { width: 99, height: 22, x: 0, y: 44, collapsed: false, ticks: 100, label: '1', unitLabel: '100', itemIndex: 0 },
      { width: 3, height: 22, x: 100, y: 44, collapsed: true, ticks: 3, label: '2', unitLabel: '2', itemIndex: 1 },
    ]);
  });
});
