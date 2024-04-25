type Handler = (data?: any) => void;

const events: Record<string, Handler[]> = {};
function request(url: string, options: Record<string, any>) {
  const headers = { ...(options.headers || {}) };

  options = { ...options, headers };

  return fetch(url, options).then(
    (response) => {
      if (response.status === 403) {
        return request.error("暂无权限进行此操作");
      }

      // 业务数据正常返回
      return response.json().then(
        (res) => {
          console.log("杰哥测试---", res);
          // 业务逻辑 -1 -2
          if (res.code !== 200) {
            if (res.code === 2) {
              return request.error(res);
            }
            request.trigger(`${res.code}`, res);
            return request.error(res);
          }

          return res.result;
        },
        (err) => {
          request.trigger("DATA-ERROR");
          return request.error(err);
        }
      );
    },
    (err) => {
      if (err && err.status && err.status === 500) {
        request.trigger("SERVER-ERROR");
      } else {
        request.trigger("FETCH-ERROR");
        request.error(err);
      }
    }
  );
}

request.error = (err: any) => {
  throw err;
};

request.defaults = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
};

request.pathDefaults = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
};

request.get = (url: string, options?: Record<string, any>) => {
  options = options || {};
  options.method = "GET";
  options = Object.assign(
    {},
    options && options.ignoreServiceName
      ? request.pathDefaults
      : request.defaults,
    options
  );
  return request(url, options);
};

request.post = (
  url: string,
  data?: Record<string, any>,
  options?: Record<string, any>
) => {
  options = options || {};
  options.body = JSON.stringify(data || {});
  options.method = "POST";
  options = Object.assign(
    {},
    options && options.ignoreServiceName
      ? request.pathDefaults
      : request.defaults,
    options
  );
  return request(url, options);
};

request.put = (
  url: string,
  data: Record<string, any>,
  options?: Record<string, any>
) => {
  options = options || {};
  options.body = JSON.stringify(data || {});
  options.method = "PUT";
  options = Object.assign(
    {},
    options && options.ignoreServiceName
      ? request.pathDefaults
      : request.defaults,
    options
  );
  return request(url, options);
};

request.patch = (
  url: string,
  data: Record<string, any>,
  options?: Record<string, any>
) => {
  options = options || {};
  options.body = JSON.stringify(data || {});
  options.method = "PATCH";
  options = Object.assign(
    {},
    options && options.ignoreServiceName
      ? request.pathDefaults
      : request.defaults,
    options
  );
  return request(url, options);
};

request.delete = (url: string, options?: Record<string, any>) => {
  options = options || {};
  options.method = "DELETE";
  options = Object.assign(
    {},
    options && options.ignoreServiceName
      ? request.pathDefaults
      : request.defaults,
    options
  );
  return request(url, options);
};

request.on = (name: string, handler: Handler) => {
  if (!events[name]) events[name] = [];
  events[name].push(handler);
};

request.defaultHandles = [
  (err: any) => {
    console.error("请求异常，请检查", err); // these error ignores
  },
];

request.trigger = (name: string, data?: any) => {
  const handlers = events[name] || request.defaultHandles;
  if (handlers) {
    handlers.forEach((handler) => handler(data));
  }
};

request.getExpandObjParams = (obj?: Record<string, any>) => {
  obj = obj || {};
  return `?${Object.keys(obj)
    .map((key) => {
      return [key, obj![key]].join("=");
    })
    .join("&")}`;
};

export default request;
