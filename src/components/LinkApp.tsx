import React from 'react';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  fontStyle,
  FontStyleProps,
  layout,
  LayoutProps,
  lineHeight,
  LineHeightProps,
  size,
  SizeProps,
  space,
  SpaceProps,
  textStyle,
  TextStyleProps,
  typography,
  TypographyProps,
  variant
} from 'styled-system';

import { isUrl } from '@utils/isUrl';

type LinkStyleProps = SpaceProps &
  LineHeightProps &
  FontStyleProps &
  SizeProps &
  ColorProps &
  ColorStyleProps &
  TextStyleProps &
  LayoutProps &
  TypographyProps & {
    variant?: keyof typeof LINK_VARIANTS;
    $underline?: boolean;
    $textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  };

const LINK_VARIANTS = {
  barren: {
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 120ms ease'
  },
  underlineLink: {
    color: 'inherit',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'all 120ms ease',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  defaultLink: {
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: { _: 0, sm: 1 },
    lineHeight: { _: 0, sm: 1 },
    color: 'BLUE_BRIGHT',
    transition: 'all 120ms ease',
    '&:hover': {
      opacity: 0.8,
      color: 'BLUE_BRIGHT'
    },
    svg: {
      fill: 'BLUE_BRIGHT'
    },
    '&:hover svg': {
      fill: 'BLUE_BRIGHT'
    },
    '&:active': {
      opacity: 1
    },
    '&:focus': {
      opacity: 1
    }
  }
};

const SLink = styled('a')<LinkStyleProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>`
  /** Overide @mycrypto/ui global styles */
  && {
    ${variant({
      variants: LINK_VARIANTS
    })}
  }
  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${layout}
  ${({ $textTransform }) => $textTransform && { 'text-transform': $textTransform }}
  ${({ $underline }) => $underline && { 'text-decoration': 'underline' }};
`;

const SRouterLink = styled(RouterLink)<LinkStyleProps & RouterLinkProps>`
  /** Overide @mycrypto/ui global styles */
  && {
    ${variant({
      variants: LINK_VARIANTS
    })}
  }
  ${space}
  ${fontStyle}
  ${color}
  ${size}
  ${colorStyle}
  ${textStyle}
  ${lineHeight}
  ${typography}
  ${layout}
  ${({ $underline }) => $underline && { 'text-decoration': 'underline' }}
  ${({ $textTransform }) => $textTransform && { 'text-transform': $textTransform }}
`;

interface LinkProps {
  readonly href: string;
  readonly isExternal?: boolean;
  readonly variant?: keyof typeof LINK_VARIANTS;
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void | undefined;
}

type Props = LinkProps &
  (React.ComponentProps<typeof SLink> | React.ComponentProps<typeof SRouterLink>);

const LinkApp: React.FC<Props> = ({
  href,
  isExternal = false,
  variant = 'defaultLink',
  onClick,
  ...props
}) => {
  if (!isExternal && isUrl(href)) {
    throw new Error(
      `LinkApp: Received href prop ${href}. Set prop isExternal to use an external link.`
    );
  }
  return isExternal ? (
    <SLink
      href={href}
      variant={variant}
      target="_blank"
      onClick={onClick}
      {...props}
      // @SECURITY set last to avoid override
      rel="noreferrer"
    />
  ) : (
    <SRouterLink to={href} variant={variant} onClick={onClick} {...props} />
  );
};

export default LinkApp;
