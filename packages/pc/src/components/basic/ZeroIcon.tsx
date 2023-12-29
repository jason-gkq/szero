import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { useEnv } from '@szero/hooks';
import * as Icons from '@ant-design/icons';
// const Icons: any = await import('@ant-design/icons');

const env = useEnv();

const IconFont = createFromIconfontCN({
  scriptUrl: env.IconFontUrls,
});

type IProps = {
  type: string;
  options?: any;
};

export default ({ type, options }: IProps) => {
  let ICON;
  if (type) {
    ICON = (Icons as any)[String(type)];
  }
  if (ICON) {
    return <ICON {...options} />;
  } else {
    return (env.IconFontUrls && <IconFont type={type} {...options} />) || <></>;
  }
};
