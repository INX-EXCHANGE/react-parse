(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'regenerator-runtime', 'redux-saga/effects', '../../server/httpWrapper', '../../types', '../../server/api', '../actions', '../../helpers', '../../server/Logger'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('regenerator-runtime'), require('redux-saga/effects'), require('../../server/httpWrapper'), require('../../types'), require('../../server/api'), require('../actions'), require('../../helpers'), require('../../server/Logger'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regeneratorRuntime, global.effects, global.httpWrapper, global.types, global.api, global.actions, global.helpers, global.Logger);
    global.fetchCollection = mod.exports;
  }
})(this, function (exports, _regeneratorRuntime, _effects, _httpWrapper, _types, _api, _actions, _helpers, _Logger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fetchCollection;

  var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

  var _httpWrapper2 = _interopRequireDefault(_httpWrapper);

  var _types2 = _interopRequireDefault(_types);

  var _api2 = _interopRequireDefault(_api);

  var _Logger2 = _interopRequireDefault(_Logger);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _marked = _regeneratorRuntime2.default.mark(fetchCollection);

  var START = _types2.default.FETCH_START;
  var FAILED = _types2.default.FETCH_FAILED;
  var FAILED_NETWORK = _types2.default.FETCH_FAILED_NETWORK;
  var FINISHED = _types2.default.FETCH_FINISHED;

  function fetchCollection(action) {
    var _action$payload, targetName, schemaName, query, skip, page, enableCount, keys, include, order, limit, target, res, errType, data, info;

    return _regeneratorRuntime2.default.wrap(function fetchCollection$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _action$payload = action.payload, targetName = _action$payload.targetName, schemaName = _action$payload.schemaName, query = _action$payload.query, skip = _action$payload.skip, page = _action$payload.page, enableCount = _action$payload.enableCount, keys = _action$payload.keys, include = _action$payload.include, order = _action$payload.order, limit = _action$payload.limit;
            target = targetName || schemaName;
            _context.next = 4;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: START, error: null, loading: true }));

          case 4:
            return _context.delegateYield((0, _httpWrapper2.default)(_api2.default.query, schemaName, query, limit, skip, enableCount, keys, include, order), 't0', 5);

          case 5:
            res = _context.t0;

            if (!res.error) {
              _context.next = 14;
              break;
            }

            errType = res.message === 'Network Error' ? FAILED_NETWORK : FAILED;

            console.error('fetchCollection err: ', schemaName, res.error);
            _context.next = 11;
            return (0, _effects.put)((0, _actions.setOnStore)({ targetName: target, status: errType, error: res, loading: false }));

          case 11:
            _Logger2.default.onError('GET', action, errType);
            _context.next = 19;
            break;

          case 14:
            data = (0, _helpers.dig)(res, 'data.results');
            info = {
              schemaName: schemaName,
              query: query,
              skip: skip,
              page: page,
              enableCount: enableCount,
              keys: keys,
              include: include,
              order: order,
              limit: limit,
              count: res.data.count,
              timestamp: Date.now()
            };
            _context.next = 18;
            return (0, _effects.put)((0, _actions.setOnStore)({
              targetName: target,
              status: FINISHED,
              error: null,
              data: data,
              info: info,
              loading: false
            }));

          case 18:
            _Logger2.default.onSuccess('GET', action, FINISHED);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked, this);
  }
  /* eslint no-unused-vars: "off" */
});