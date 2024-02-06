import * as React from 'react';
import { expect } from 'chai';
import {
  createRenderer,
  createMount,
  describeConformanceUnstyled,
  screen,
} from '@mui-internal/test-utils';
import { Popper, popperClasses } from '@mui/base/Popper';

function createAnchor(element = 'div') {
  const anchor = document.createElement(element);
  document.body.appendChild(anchor);
  return anchor;
}

describe('<Popper />', () => {
  const { render } = createRenderer();
  const mount = createMount();

  const defaultProps = {
    anchorEl: () => createAnchor(),
    children: <span>Hello World</span>,
    open: true,
  };

  describeConformanceUnstyled(<Popper {...defaultProps} />, () => ({
    inheritComponent: 'div',
    render,
    mount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      // https://github.com/facebook/react/issues/11565
      'reactTestRenderer',
      'componentProp',
    ],
    slots: {
      root: {
        expectedClassName: popperClasses.root,
      },
    },
  }));

  it('should not pass ownerState to overridable component', () => {
    const CustomComponent = React.forwardRef<HTMLDivElement, any>(({ ownerState }, ref) => (
      <div ref={ref} data-testid="foo" id={ownerState.id} />
    ));
    render(<Popper anchorEl={() => createAnchor()} open slots={{ root: CustomComponent }} />);

    expect(screen.getByTestId('foo')).to.not.have.attribute('id', 'id');
  });
});
