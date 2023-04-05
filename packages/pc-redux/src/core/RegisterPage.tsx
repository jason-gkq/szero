import React from 'react';
import ContainerPage from './ContainerPage';
import { Exception } from '../components';
import { isEmptyObject } from '@szero/utils';
import type { IModel } from '../redux';
import type { IPageConfig } from './ContainerPage';

export interface ICProps {
  $dispatch: Function;
  $globalActions: any;
  $globalSelectors: any;
  $hasError?: number;
  $model?: any;
  $payload: any;
  $route: string;
  checkPermission: (permissions: string[]) => boolean;
  [key: string]: any;
}

export default (pageConfig: IPageConfig, pageModel?: IModel) =>
  (WrappedComponent: typeof React.PureComponent) => {
    @ContainerPage(pageConfig, pageModel)
    class BasePageComponent extends WrappedComponent<ICProps, any> {
      constructor(props: ICProps) {
        super(props);
      }

      componentDidMount() {
        if (super.componentDidMount) {
          super.componentDidMount();
        }

        if (!pageModel || isEmptyObject(pageModel)) {
          return;
        }

        /**
         * 前置执行 onReady 方法；
         */
        if (pageModel.actions.onReady) {
          const { $dispatch, $payload } = this.props;
          // setTimeout(() => {
          /* 传入页面options 即可： this.props.location.state */
          $dispatch(pageModel.actions.onReady($payload));
          // }, 0);
        }
      }

      render() {
        const { $hasError } = this.props;
        if ($hasError) {
          return <Exception code={$hasError} />;
        }
        return super.render();
      }
    }

    return BasePageComponent;
  };
