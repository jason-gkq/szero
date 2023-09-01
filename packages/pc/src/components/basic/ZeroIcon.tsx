import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { useEnv } from '@szero/hooks';

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
    ICON = require(`@ant-design/icons`)[String(type)];
  }
  if (ICON) {
    return <ICON {...options} />;
  } else {
    return (env.IconFontUrls && <IconFont type={type} {...options} />) || <></>;
  }
};
