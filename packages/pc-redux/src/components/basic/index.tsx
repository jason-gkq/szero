/**
 * class组件的memo封装
 */
export { default as MemoComponent } from './MemoComponent';
/**
 * 组件封装
 */
export { default as Loading } from './Loading';
export { default as PageLoading } from './PageLoading';
export { default as Exception } from './Exception/Exception';
/**
 * 权限
 */
export { default as GuardPermission } from './Permission/GuardPermission';
export { default as PermissionA } from './Permission/PermissionA';
export { default as PermissionButton } from './Permission/PermissionButton';

/**
 * 组件二次封装
 */
export { useNiceModal, NiceModal } from './NiceModalRedex';
export { default as NiceConfirm } from './NiceConfirm';
