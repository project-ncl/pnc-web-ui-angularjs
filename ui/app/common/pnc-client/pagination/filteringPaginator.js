/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014-2020 Red Hat, Inc., and individual contributors
 * as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  var module = angular.module('pnc.common.pnc-client.pagination');

  /**
   * @ngdoc service
   * @name pnc.common.pnc-client.pagination:filteringPaginator
   * @description
   * A paginator that provides additional methods for filtering and
   * searching.
   *
   * @author Alex Creasy
   */
  module.factory('filteringPaginator', [
    '$log',
    'page',
    'paginator',
    'rsqlQuery',
    function ($log, $page, paginator, rsqlQuery) {

      var SEARCH_WILDCARD_CHAR = '*';

      /**
       * Create a filteringPaginator with specific page.
       *
       * @param {object} page - The page object to create the filteringPaginator.
       * @param {array} search - search properties for the filteringPaginator.
       * @returns that - the paginator to be used.
       */
      function filteringPaginator(page, search) {
        var prototype = paginator(page);
        var that = Object.create(prototype);

        // Filters applied by the user.
        var activeFilters = [];

        var sortBy = null;

        // List of properties to be used in a general search
        var searchProperties = search || [];

        // Search term the user has queried for.
        var activeSearch = null;

        var sortChangeCallbacks = [];

        // List of filters for search by direct query param
        var directQueryParams = new Map();

        // The userId criteria that need to be added to the filter.
        let filterUserId = page.userId;


        /*
         * Generates an RSQL query string based on the current internal state.
         */
        function generateQ() {
          var q = rsqlQuery();

          if(filterUserId){
            if (!q.where) {
              q = q.and();
            }
            q = q.where('user.id').eq(filterUserId);
          }

          if (activeFilters.length > 0) {

            const activeRsqlFilters = activeFilters.filter(f => f.method === 'RSQL');

            // Apply filters
            activeRsqlFilters.forEach(function (filter) {
              if (!q.where) {
                q = q.and();
              }
              q = q.where(filter.field)[filter.comparator](filter.value);
            });

          }

          if (!_.isEmpty(activeSearch) && searchProperties.length > 0) {

            // Apply search fields
            if (!q.where) {
              q = q.and();
            }

            searchProperties.forEach(function (field) {
              if (!q.where) {
                q = q.or();
              }

              q = q.where(field).like(activeSearch);
            });
          }

          return q.end ? q.end() : undefined;
        }

       /**
        * Overides prototype method.
        */
        that.fetch = function (params) {
          params = params || {};

          params.q = generateQ();

          if (!_.isEmpty(sortBy)) {
            params.sort = sortBy;
          }

          // Add filters for search by direct query param
          activeFilters
              .filter(f => f.method === 'QUERY_PARAM')
              .forEach(f => {
                params[f.field] = f.value;
                directQueryParams.set(f.field, f.value);
              });

            directQueryParams.forEach((value, key) => {
              if(activeFilters.filter(f => f.method === 'QUERY_PARAM' && f.field === key).length < 1){
                delete params[key];
                directQueryParams.delete(key);
              }
            });

          return prototype.fetch.call(this, params);
        };


        /**
         * Adds the active filter to the paginator but does not refresh the
         * internal page state. Call apply() afterwards to update the page.
         *
         *
         * e.g.
         * fp.addFilter({ field: 'buildConfiguration.name', value: 'jboss*'}).apply();
         * fp.addFilter({ field: 'buildConfiguration.status', value: 'SUCCESS', comparator: 'eq' }).apply();
         *
         * @param {object|array} filter - One or more filter objects, or an array
         * of filter objects.
         * @param {string} filter.field - the field to filter
         * @param {string} filter.value - the value of the query to filter by, supports
         * wildcards using the '*' character.
         * @param {string} filter.comparator - the RSQL comparator to use, should be
         * string name of a method from common/pnc-client/rsql/comparator.js. Default value
         * is 'like'.
         * @param {string} filter.method - the method of making the query with the backend, supported values are:
         *  'RSQL' - The query is made by generating an RSQL query
         *  'QUERY_PARAM' - the query is made by using a dedicated querystring param.
         * Default value is 'RSQL'.
         * @returns this - to support method chaining.
         */
        that.addFilter = function (filter) {
          if (_.isUndefined(filter)) {
            throw new Error('Undefined argument passed to method addFilter');
          }

          if (!_.isArray()) {
            filter = [ filter ];
          } else if (arguments.length > 1) {
            filter = arguments;
          }

          filter.forEach(function (f) {
            if (!f.field || !f.value) {
              throw new Error('Invalid filter, must contain properties `field` and `value`: ' + JSON.stringify(f));
            }
            if (!f.comparator) {
              f.comparator = 'like';
            }
            if (!f.method) {
              f.method = 'RSQL';
            }

            if (f.comparator === 'like') {
              let isExcluding = f.value.substr(0,1) === '!';
              f.value = '%' + f.value + '%'; // always search for substring with like

              if (isExcluding && f.method === 'RSQL') {
                f.value = '%' + f.value.substr(2); // remove '!'
                f.comparator = 'notlike';
              }

              else if (f.method === 'QUERY_PARAM') {
                if (isExcluding) {
                  // Current form: %!<filter>%
                  // Backend expects: !%<filter>% - switch first two characters
                  f.value = '!%' + f.value.substr(2);
                }
              }
            }

            activeFilters.push(f);
          });
          return this;
        };

        /**
         * Removes the given active filter but does not refresh the internal
         * page state, call apply() afterwards to update the page.
         *
         * @param {object} filter - the filter object to remove.
         * @returns this - to support method chaining.
         */
        that.removeFilter = function (filter) {
          activeFilters.splice(activeFilters.findIndex(function(elem) {
            return filter.name === elem.name && filter.value === elem.value;
          }), 1);
          return this;
        };

        /**
         * Clears any active filters but does not refresh the internal page state,
         * call apply() afterwards to update the page
         *
         * @returns this - to support method chaining.
         */
        that.clearFilters = function () {
          activeFilters = [];
          return this;
        };

        /**
         * Sorts the page by the given field but does not refresh the internal
         * page state, call apply() afterwards to update the page.
         *
         * e.g. fp.addFilter({ field: 'user.username', value: 'bobby_tables'})
         *        .sortBy('buildConfiguration.id', true)
         *        .apply();
         *
         * @param {string} field - the name of the field to order by.
         * @param {boolean} desc - if true sort descending, otherwise sortBy
         * ascending.
         * @returns this - to allow method chaining.
         */
        that.sortBy = function (field, desc) {
          if (field && field.id) {
            var order = desc ? 'desc' : 'asc';
            sortBy = '=' + order + '=' + field.id;
          }

          var currentSortConfig = { 'field': field, 'asc': !desc };
          handleSortChangeCallbacks(currentSortConfig);
          return this;
        };

        /**
         * Clears the current sort paramaters by does not refresh the internal
         * page state, call apply() afterwards to update the page.
         *
         * e.g. fp.clearSort().apply();
         *
         * @returns this - to allow method chaining.
         */
        that.clearSort = function () {
          sortBy = null;

          handleSortChangeCallbacks();
          return this;
        };

        /**
         * Provide an injection interface to others and save it to local callback stack
         */
        that.addSortChangeListener = function (callbackFn) {
          sortChangeCallbacks.push(callbackFn);
        };

        /**
         * Execute all callback functions that injected to the paginator
         * and pass in current sorting configuration
         */
        function handleSortChangeCallbacks(currentSortConfig) {
          sortChangeCallbacks.forEach((callback) => {
            callback(currentSortConfig);
          });
        }

       /**
        * Applies any filter / search terms and refreshes the internal
        * page state.
        *
        * @returns {promise} - a promise which is resolved with the paginator
        * instance itself.
        */
        that.apply = function () {
          return this.get(0);
        };

        /**
         * Searches for a term against the configured search fields and
         * refreshes the internal page state.
         *
         * @param {string} query - the term to search for
         * @param {boolean} wrapInWildCards - if true, prefixes and suffixes
         * the search term with wildcards.
         * @returns {promise} - a promise which is resolved with the paginator
         * instance itself.
         */
        that.search = function (query, wrapInWildCards) {
          if (wrapInWildCards) {
            query = SEARCH_WILDCARD_CHAR + query + SEARCH_WILDCARD_CHAR;
          }
          activeSearch = query;
          return this.apply();
        };

        /**
         * Clears the current search and refreshes the internal page state.
         *
         * @returns {promise} - a promise which is resolved with the paginator
         * instance itself.
         */
         that.clearSearch = function () {
           activeSearch = null;
           return this.apply();
         };

        return that;
      }

      return filteringPaginator;
    }
  ]);

})();
