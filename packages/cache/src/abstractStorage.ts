function getTag<T>(value?: T): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

function isObjectLike<T>(value?: T): boolean {
  return typeof value === 'object' && value !== null;
}

function isPlainObject<T>(value?: T): boolean {
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

type IEnvironment = {
  prefixUnable: string[];
  prefix: string;
};
type CacheType = 'local' | 'session';
/**
 * prefix local和session缓存统一前缀，对cookie不生效；
 * prefixUnable 不需要前缀的的变量，默认统一添加前缀；
 */
const environment: IEnvironment = {
  prefixUnable: [],
  prefix: '',
};

export const setCacheEnvironment = (props: {
  prefixUnable?: string[];
  prefix?: string;
}) => {
  Object.assign(environment, props || {});
};

class NameStorage {
  store: Record<string, any>;
  proxy: { local: Record<string, any>; session: Record<string, any> };

  constructor(type: CacheType) {
    let ret;

    if (window.name) {
      try {
        ret = JSON.parse(window.name);
      } catch (e) {
        ret = {};
      }
    }

    if (!isPlainObject(ret)) {
      ret = {};
    }

    if (!ret.session) {
      ret.session = {};
    }

    if (!ret.local) {
      ret.local = {};
    }

    this.proxy.local = ret.local;
    this.proxy.session = ret.session;

    this.store = this.proxy[type];
  }

  getItem = (key: string) => {
    return this.store[key];
  };

  setItem = (key: string, value: any) => {
    this.store[key] = value;
    this._saveNameValue();
  };

  removeItem = (key: string) => {
    delete this.store[key];
    this._saveNameValue();
  };

  clear = () => {
    this.store = {};
    this._saveNameValue();
  };

  _saveNameValue = () => {
    const ret = {
      session: this.proxy.session,
      local: this.proxy.local,
    };

    window.name = JSON.stringify(ret);
  };
}

export class AbstractStorage {
  hasStorage: { local: number; session: number } = {
    local: 1,
    session: 1,
  };
  type: CacheType;
  proxy: Storage | NameStorage;

  constructor(type: CacheType) {
    this.checkStorage();
    if (this.hasStorage[type]) {
      this.proxy = type === 'local' ? localStorage : sessionStorage;
    } else {
      this.proxy = new NameStorage(type);
    }
    this.type = type;
  }

  /**
   * @description
   * 检查浏览器是否支持本地存储
   * @example
   * local.checkStorage()
   */
  checkStorage = () => {
    try {
      sessionStorage.setItem('privateTest', '1');
    } catch (e) {
      this.hasStorage.session = 0;
    }

    try {
      localStorage.setItem('privateTest', '1');
    } catch (e) {
      this.hasStorage.local = 0;
    }
  };

  /**
   * @description
   * 获取缓存
   * @example
   * local.get('mykey')
   */
  get = (key: string) => {
    key = this.getKey(key);
    let value = this.proxy.getItem(key);

    if (value) {
      value = JSON.parse(value);

      if (value) {
        if (value.expires) {
          // 为了安全起见，手机时间改了
          const diff = Date.now() - value.timestamp;

          if (diff > value.expires || diff < 0) {
            // 清除
            this.proxy.removeItem(key);
            return null;
          }
        }
        return value.value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  /**
   * @description
   * 设置缓存
   * @example
   * local.set('mykey', 'value', '1D')
   */
  set = (key: string, value: any, expires?: string) => {
    key = this.getKey(key);
    const ret: any = {
      value: value,
    };

    if (expires) {
      ret.expires = this.setExpires(expires);
      ret.timestamp = Date.now();
    }

    try {
      this.proxy.setItem(key, JSON.stringify(ret));
    } catch (e) {
      if (this.isQuotaExceeded(e)) {
        // Storage full, maybe notify user or do some clean-up
        this.removeHttp();
      }
    }
  };

  /**
   * @description
   * 删除缓存
   * @example
   * local.remove('mykey')
   */
  remove = (key: string) => {
    this.proxy.removeItem(this.getKey(key));
  };

  /**
   * @description
   * 清除所有缓存
   * @example
   * local.clear()
   */
  clear = () => {
    for (const i in this.getForObject()) {
      if (environment.prefixUnable.indexOf(i) === -1) {
        this.proxy.removeItem(i);
      }
    }
  };

  /**
   * @description
   * 清除所有缓存
   * @example
   * local.clearAll()
   */
  clearAll = () => {
    for (const i in this.getForObject()) {
      this.proxy.removeItem(i);
    }
  };

  /**
   * @description
   * 删除ajax缓存
   * @example
   * local.removeHttp('mycar/getMyDefaultCar')
   */
  removeHttp = (url = '') => {
    url = environment.prefix + 'http:' + url;
    for (const i in this.getForObject()) {
      if (i.startsWith(url)) {
        this.proxy.removeItem(i);
      }
    }
  };

  /**
   * @description
   * 获取缓存key
   * @example
   * local.getKey('mykey')
   */
  getKey = (key: string) => {
    if (environment.prefixUnable.indexOf(key) !== -1) {
      return key;
    }
    return environment.prefix + key;
  };

  /**
   * @description
   * 获取所有缓存key
   * @example
   * local.getForObject()
   */
  getForObject = () => {
    return this.proxy instanceof NameStorage ? this.proxy.store : this.proxy;
  };

  isQuotaExceeded = (e?: any): boolean => {
    let quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  };

  setExpires = (time: string) => {
    const str = time + '';
    let count = 0;

    str.replace(/(\d+)([DHMS])/g, function (match, $1, $2) {
      $1 = parseInt($1, 10);
      switch ($2) {
        case 'D':
          count += $1 * 24 * 3600;
          break;
        case 'H':
          count += $1 * 3600;
          break;
        case 'M':
          count += $1 * 60;
          break;
        case 'S':
          count += $1;
          break;
      }
      return str;
    });

    // time = count ? count : time;

    return count * 1000;
  };
}
