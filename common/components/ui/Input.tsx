import React, { HTMLProps } from 'react';
import classnames from 'classnames';
import './Input.scss';

interface State {
  hasBlurred: boolean;
  /**
   * @description when the input has not had any values inputted yet
   * e.g. "Pristine" condition
   */
  isStateless: boolean;
}

interface OwnProps extends HTMLProps<HTMLInputElement> {
  isValid: boolean;
  showValidAsPlain?: boolean;
}

class Input extends React.Component<OwnProps, State> {
  public state: State = {
    hasBlurred: false,
    isStateless: true
  };

  public render() {
    const hasValue = !!this.props.value && this.props.value.toString().length > 0;
    const classname = classnames(
      this.props.className,
      'input-group-input',
      'form-control',
      this.state.isStateless
        ? ''
        : this.props.isValid
          ? this.props.showValidAsPlain ? '' : `is-valid valid`
          : `is-invalid invalid`,
      this.state.hasBlurred && 'has-blurred',
      hasValue && 'has-value'
    );
    return (
      <input
        {...this.props}
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        onChange={this.handleOnChange}
        onWheel={this.props.type === 'number' ? this.preventNumberScroll : undefined}
        className={classname}
      />
    );
  }

  private handleOnChange = (args: React.FormEvent<HTMLInputElement>) => {
    if (this.state.isStateless) {
      this.setState({ isStateless: false });
    }
    if (this.props.onChange) {
      this.props.onChange(args);
    }
  };
  // When number inputs are scrolled on while in focus, the number changes. So we blur
  // it if it's focused to prevent that behavior, without preventing the scroll.
  private preventNumberScroll(ev: React.WheelEvent<HTMLInputElement>) {
    if (document.activeElement === ev.currentTarget) {
      ev.currentTarget.blur();
    }
  }
}

export default Input;
