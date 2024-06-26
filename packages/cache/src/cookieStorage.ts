class CookieStorage {
  /**
   * @description 获取某个cookie
   * @param sKey
   * @returns
   * @example
   * CookieStorage.getItem('name');
   */
  getItem = (sKey: string) => {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  };

  /**
   * @description 设置某个cookie
   * @param sKey
   * @param sValue
   * @param vEnd
   * @param sPath
   * @param sDomain
   * @param bSecure
   * @returns
   * @example
   * CookieStorage.setItem('name', 'value', 365, '/', 'example.com', true);
   */
  setItem = (
    sKey: string,
    sValue: any,
    vEnd: string | number | Date,
    sPath = '/',
    sDomain = '',
    bSecure = false
  ) => {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + (vEnd as any).toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  };

  /**
   * @description 删除某个cookie
   * @param sKey
   * @param sPath
   * @param sDomain
   * @returns
   * @example
   * CookieStorage.removeItem('name');
   */
  removeItem = (sKey: string, sPath = '/', sDomain = '') => {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
    return true;
  };

  /**
   * 检查是否存在某个cookie
   * @param sKey
   * @returns
   * @example
   * CookieStorage.hasItem('name');
   */
  hasItem = (sKey: string) => {
    if (!sKey) {
      return false;
    }
    return new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
        '\\s*\\='
    ).test(document.cookie);
  };

  /**
   * 清除所有cookie
   */
  clearAll = () => {
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      keys.forEach((key) => {
        document.cookie = key + '=0;expires=' + new Date(0).toUTCString();
      });
    }
  };

  keys = /* optional method: you can safely remove it! */ () => {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  };

  /**
   *
   * @returns {string}
   */
  getDomain = () => {
    const ret = location.hostname.split('.');

    if (ret.length > 1) {
      // ip情况
      if (/^\d+$/.test(ret[0])) {
        return ret.join('.');
      } else {
        return '.' + ret[ret.length - 2] + '.' + ret[ret.length - 1];
      }
    } else {
      return ret[0];
    }
  };
}

export default new CookieStorage();
