import React from 'react';

import { Box, Icon, LinkApp } from '@components';
import { translateRaw } from '@translations';
import { BusyBottomConfig } from '@types';

import { configs } from './constants';

export const BusyBottom = ({ type }: { type: BusyBottomConfig }) => {
  return (
    <Box mt={4}>
      <Box style={{ textAlign: 'center' }} mb={2}>
        {translateRaw('BUSY_BOTTOM_HEADER')}
      </Box>
      <Box variant="rowAlign" justifyContent="center">
        {configs[type].map(({ copy, copyVariables, link, external }, index) => {
          return (
<<<<<<< HEAD
            <React.Fragment key={index}>
=======
            <Box key={index}>
>>>>>>> c5a320e93 (Create LinkApp)
              <LinkApp isExternal={!!external} href={link}>
                {translateRaw(copy, copyVariables)}
              </LinkApp>

              {index < configs[type].length - 1 && (
                <Box paddingX="15px" paddingY={1} variant="rowAlign">
                  <Icon type="separator" />
                </Box>
              )}
<<<<<<< HEAD
            </React.Fragment>
=======
            </Box>
>>>>>>> c5a320e93 (Create LinkApp)
          );
        })}
      </Box>
    </Box>
  );
};
