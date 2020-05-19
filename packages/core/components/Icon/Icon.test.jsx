import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { waitRender, act } from '../shared/test/utils';

import useIcon from './useIcon';
import Icon from './Icon';
import { BUFFER_SIZES } from '../../jest.setup';

describe('<Icon />', () => {
  it('should match snapshot', async () => {
    const { container } = await waitRender(<Icon name="bat" />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with different width and height', async () => {
    const { container } = await waitRender(
      <>
        <Icon name="bat" width={10} height={10} />
        <Icon name="bat" width={20} height={20} />
        <Icon name="bat" width={30} height={30} />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with different size', async () => {
    const { container } = await waitRender(<Icon name="bat" size={16} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with different size and without a fallback', async () => {
    const { container } = await waitRender(
      <Icon name="bat" size={64} fallback={false} />,
    );

    expect(container).toMatchSnapshot();
  });
});

describe('useIcon', () => {
  it('should return the icon by given a name', async () => {
    const { result, waitForNextUpdate } = renderHook(
      ({ name, size }) => useIcon({ name, size }),
      {
        initialProps: { name: 'bat', size: 16 },
      },
    );

    expect(result.current.iconUrl).toBe('');

    await waitForNextUpdate();

    expect(result.current.iconUrl).toBe(BUFFER_SIZES[16]);

    expect(result.current.availableIcons).toHaveLength(
      Object.keys(BUFFER_SIZES).length,
    );
  });

  it('should return no iconUrl if you ommit the size', async () => {
    const { result, waitForNextUpdate } = renderHook(
      ({ name, size }) => useIcon({ name, size }),
      {
        initialProps: { name: 'bat' },
      },
    );

    expect(result.current.iconUrl).toBe('');

    await waitForNextUpdate();

    expect(result.current.iconUrl).toBe(undefined);

    expect(result.current.availableIcons).toHaveLength(
      Object.keys(BUFFER_SIZES).length,
    );
  });

  it('should return a fallback iconUrl by given a wrong size', async () => {
    const { result, waitForNextUpdate } = renderHook(
      ({ name, size, fallback }) => useIcon({ name, size, fallback }),
      {
        initialProps: { name: 'bat', size: 48, fallback: true },
      },
    );

    expect(result.current.iconUrl).toBe('');

    await waitForNextUpdate();

    expect(result.current.iconUrl).toBe(Object.values(BUFFER_SIZES)[0]);

    expect(result.current.availableIcons).toHaveLength(
      Object.keys(BUFFER_SIZES).length,
    );
  });

  it('should return different icons due to variant prop', async () => {
    const iconSize = 32;
    let variant = 1;

    const { result, waitForNextUpdate } = renderHook(() =>
      useIcon({ name: 'bat', size: iconSize, variant: 1 }),
    );

    const { result: result2 } = renderHook(() =>
      useIcon({ name: 'bat', size: iconSize, variant: 2 }),
    );

    expect(result.current.iconUrl).toBe('');

    await waitForNextUpdate();

    const iconsWithIconSize = result.current.availableIcons.filter(
      i => i.size === iconSize,
    );

    expect(iconsWithIconSize).toHaveLength(2);

    const [first, second] = iconsWithIconSize;
    expect(first).not.toBe(second);

    expect(result.current.iconUrl).not.toBe(result2.current.iconUrl);
  });
});
