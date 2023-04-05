import React from 'react';
import GuardPermission from './GuardPermission';
import { Button } from 'antd';

type IProps = {
  children: any;
  permissions?: string[];
  [key: string]: any;
};
type SizeType = 'small' | 'middle' | 'large' | undefined;
type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';

export default (props: IProps) => {
  const { children, permissions, type, size, ...restProps } = props;
  const buttonType: ButtonType = type || 'primary';
  const buttonSize: SizeType = size || 'small';
  return (
    <>
      {permissions ? (
        <GuardPermission permissions={permissions}>
          <Button type={buttonType} size={buttonSize} {...restProps}>
            {children}
          </Button>
        </GuardPermission>
      ) : (
        <Button type={buttonType} size={buttonSize} {...restProps}>
          {children}
        </Button>
      )}
    </>
  );
};
