import React from 'react';
import { Spin } from 'antd';
import { getModule } from './common';
import {
  importRemote,
  ImportRemoteOptions,
  REMOTE_ENTRY_FILE,
} from './importRemote';

type IPluginProps = {
  system: ImportRemoteOptions;
};

type IOnMountProps = {
  system: ImportRemoteOptions;
  mountProps?: Record<string, any>;
};

const mountCache = new Map();
export const onMount = async (props: IOnMountProps) => {
  const {
    system,
    mountProps,
    system: { url, scope, module, remoteEntryFileName = REMOTE_ENTRY_FILE },
  } = props;
  if (!system || !url || !scope || !module) {
    return Promise.reject('No system specified');
  }

  let remoteUrl = '';
  if (typeof url === 'string') {
    remoteUrl = url;
  } else {
    remoteUrl = await url();
  }
  const key = `${remoteUrl}-${scope}-${module}`;
  if (mountCache.has(key)) {
    return Promise.resolve();
  }

  return getModule({
    remoteContainer: {
      global: scope,
      url: `${remoteUrl}/${remoteEntryFileName}`,
    },
    modulePath:
      module === '.' || module.startsWith('./') ? module : `./${module}`,
    exportName: 'onMount',
  }).then((onMount) => {
    mountCache.set(key, true);
    if (onMount) {
      return onMount(mountProps);
    } else {
      return Promise.reject(
        `plugin ${scope} has not onMount function exported.`
      );
    }
  });
};

export const PluginComponent = (props: IPluginProps) => {
  const {
    system,
    system: { url, scope, module },
  } = props;

  if (!system || !url || !scope || !module) {
    return <h2>No system specified</h2>;
  }
  const Component = React.lazy(() => importRemote({ url, scope, module }));

  return (
    <React.Suspense
      fallback={
        <div
          style={{
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size='large' />
        </div>
      }
    >
      <Component />
    </React.Suspense>
  );
};
