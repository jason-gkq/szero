import isDesktop from './isDesktop';
import isAndroid from './isAndroid';
import isIOS from './isIOS';

export const isMobile = (): boolean => !isDesktop() && (isAndroid() || isIOS());

export default isMobile;
