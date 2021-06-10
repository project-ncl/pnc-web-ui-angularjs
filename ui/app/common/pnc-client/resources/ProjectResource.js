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

  var module = angular.module('pnc.common.pnc-client.resources');

  module.value('PROJECT_PATH', '/projects/:id');

  /**
   *
   * @author Alex Creasy
   */
  module.factory('ProjectResource', [
    '$resource',
    'restConfig',
    'PROJECT_PATH',
    function($resource, restConfig, PROJECT_PATH) {
      var ENDPOINT = restConfig.getPncRestUrl() + PROJECT_PATH;

      var resource = $resource(ENDPOINT, {
        id: '@id'
      }, {
        query: {
          method: 'GET',
          isPaged: true
        },
        update: {
          method: 'PUT'
        },
        queryBuildConfigurations: {
          method: 'GET',
          url: ENDPOINT + '/build-configs',
          isPaged: true
        },
        queryBuildConfigsWithLatestBuild: {
          method: 'GET',
          url: restConfig.getPncRestUrl() + '/build-configs/x-with-latest-build?q=project.id==:id',
          isPaged: true
        },
      });

      return resource;
    }

  ]);

})();
