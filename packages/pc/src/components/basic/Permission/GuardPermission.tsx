import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { rootStore } from '../../../store';

type IDictProps = {
  permissions?: string[];
  children: any;
};

const GuardPermission = <P extends IDictProps>(props: P) => {
  const { permissions } = props;
  const permissionList = toJS(rootStore.appStore.permissions);
  const checkPermission = rootStore.appStore.checkPermission;
  if (!permissions || permissions.length == 0) {
    return props.children;
  }
  const hasPermissions =
    (checkPermission && checkPermission(permissionList, permissions)) || false;
  return <>{hasPermissions && props.children}</>;
};
export default observer(GuardPermission);
