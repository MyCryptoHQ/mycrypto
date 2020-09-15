import React from 'react';
import styled from 'styled-components';

import { Typography } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { getExpiryDate, IMembershipConfig } from '../config';

interface Props {
  membershipSelected: IMembershipConfig;
}

const BannerContainer = styled.div`
  display: flex;
  flex: 1;
  padding: ${SPACING.BASE};
  flex-direction: row;
  background-color: ${COLORS.GREY_LIGHTEST};
  margin-bottom: ${SPACING.MD};
  justify-content: center;
`;

const MembershipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: ${SPACING.SM};
`;

const Icon = styled.img``;

const Header = styled(Typography)`
  font-size: ${FONT_SIZE.LG};
  font-weight: bold;
`;

const ExpiryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MembershipReceiptBanner = ({ membershipSelected }: Props) => {
  return (
    <BannerContainer>
      <MembershipWrapper>
        <IconWrapper>
          <Icon src={membershipSelected.icon} />
        </IconWrapper>
        <div>
          <Header as="div">{translateRaw('NEW_MEMBER')}</Header>
          <ExpiryWrapper>
            <Typography as="div">
              {translateRaw('EXPIRES_ON')}
              {': '}
              {getExpiryDate(membershipSelected.key).toLocaleDateString()}
            </Typography>
          </ExpiryWrapper>
        </div>
      </MembershipWrapper>
    </BannerContainer>
  );
};

export default MembershipReceiptBanner;
