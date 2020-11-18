import React from 'react';

import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { useAccounts } from '@services/Store';
import { translateRaw } from '@translations';
import { IAppRoute } from '@types';
import { useEffectOnce } from '@vendor';

interface PrivateRouteProps extends IAppRoute {
  key: number;
}

interface PageTitleProps extends RouteComponentProps {
  pageComponent: any;
  title?: string;
}

const PageTitleRoute = ({ pageComponent: Component, title, ...props }: PageTitleProps) => {
  useEffectOnce(() => {
    document.title =
      translateRaw('PAGE_TITLE_PREPEND') + title || translateRaw('PAGE_TITLE_APPEND');
  });
  return <Component {...props} />;
};

export const PrivateRoute = ({
  component: Component,
  requireAccounts,
  ...rest
}: PrivateRouteProps) => {
  const { accounts } = useAccounts();
  return (
    <Route
      {...rest}
      render={(props) =>
        (accounts && accounts.length) || !requireAccounts ? (
          <PageTitleRoute pageComponent={Component} title={rest.title} {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.ADD_ACCOUNT.path} />
        )
      }
    />
  );
};
