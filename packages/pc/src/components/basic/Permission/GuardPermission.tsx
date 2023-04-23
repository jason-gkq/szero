import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../../store';

type IDictProps = {
  permissions?: string[];
  children: any;
};

const GuardPermission = <P extends IDictProps>(props: P) => {
  const { permissions } = props;
  if (!permissions || permissions.length == 0) {
    return props.children;
  }
  const hasPermissions =
    (rootStore.appStore.checkPermission &&
      rootStore.appStore.checkPermission(permissions)) ||
    false;
  return <>{hasPermissions && props.children}</>;
};
export default observer(GuardPermission);
