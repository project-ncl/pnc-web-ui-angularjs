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

  const module = angular.module('pnc.common.bifrost.resources');

  module.value('STATIC_LOG_TEXT_PATH', '/text');

  /**
   * @author Dennis Zhou
   */
  module.factory('StaticLogResource', [
    '$http',
    'bifrostConfig',
    'STATIC_LOG_TEXT_PATH',
    function ($http, bifrostConfig, STATIC_LOG_TEXT_PATH) {
      const ENDPOINT = bifrostConfig.getBifrostRestUrl() + STATIC_LOG_TEXT_PATH;

      let resource = {};

      resource.getStaticBuildLogText = (buildId) =>
        $http({
          url: ENDPOINT,
          method: 'GET',
          params: {
            matchFilters: `mdc.processContext:build-${buildId.id},loggerName:org.jboss.pnc._userlog_.build-log`,
            direction: 'ASC',
            batchSize: '10000',
            batchDelay: '500',
            format: 'PLAIN',
            afterLine:{timestamp: new Date()}
          },
        });

        resource.getStaticAlignmentLogText = (buildId) =>
        $http({
          url: ENDPOINT,
          method: 'GET',
          params: {
            matchFilters: `mdc.processContext:build-${buildId.id},loggerName:org.jboss.pnc._userlog_.alignment-log`,
            direction: 'ASC',
            batchSize: '10000',
            batchDelay: '500',
            format: 'LEVEL',
          },
        });
      return resource;
    },
  ]);
})();
