import React from 'react';

import { simpleRender, screen, fireEvent } from 'test-utils';

import Downloader from './Downloader';

const getComponent = (
  props: React.ComponentProps<typeof Downloader>,
  children?: React.ComponentType<any>
) => {
  const Component = children;
  return Component
    ? simpleRender(
        <Downloader {...props}>
          <Component />
        </Downloader>
      )
    : simpleRender(<Downloader {...props} />);
};

describe('Downloader', () => {
  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has a button by default', () => {
    getComponent({ appStore: { foo: 'bar' } });
    expect(screen.getByText(/download/i)).toBeInTheDocument();
  });

  it('renders its children who replace the default button', () => {
    getComponent({ appStore: { foo: 'bar' } }, () => <button>Hello</button>);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.queryByText(/download/i)).not.toBeInTheDocument();
  });

  it('calls the provided callback on click', () => {
    const cb = jest.fn();
    getComponent({ appStore: { foo: 'bar' }, onClick: cb }, () => <button>Hello</button>);
    fireEvent.click(screen.getByText(/hello/i));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
