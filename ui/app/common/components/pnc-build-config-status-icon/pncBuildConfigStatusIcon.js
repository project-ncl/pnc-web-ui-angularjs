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

  /**
   * A widget that shows a combined icon / text that indicates the status of the
   * latest Build of the provided Build Config. The component listens for websocket
   * notifations and updates the status display automatically if it has changed.
   */
  angular.module('pnc.common.components').component('pncBuildConfigStatusIcon', {
    bindings: {
      /**
       * Object: BuildConfig object to display the status of
       */
      buildConfig: '<'
    },
    templateUrl: 'common/components/pnc-build-config-status-icon/pnc-build-config-status-icon.html',
    controller: ['$scope', 'events', 'BuildConfigResource', Controller]
  });


  function Controller($scope, events, BuildConfigResource) {
    const $ctrl = this;

    // -- Controller API --

    // --------------------

    function updateBuild (buildConfig) {
      $ctrl.build = buildConfig.latestBuild;
      $ctrl.build.user = {username: buildConfig.latestBuildUsername};
      $ctrl.build.project = {id: buildConfig.project.id};
      $ctrl.build.buildConfigRevision = {id: buildConfig.id};
    }


    $ctrl.$onInit = () => {
      if ($ctrl.buildConfig.latestBuild) {
        updateBuild($ctrl.buildConfig);
      } else if ($ctrl.buildConfig.latestBuild === undefined){
//      Only enter when the latestBuild is undefined, which means the bc was not returned by x-with-latest-build
//      This is to avoid duplicate query that already triggered for x-with-latest-build results
        BuildConfigResource.queryWithLatestBuildByBCId({buildConfigId: $ctrl.buildConfig.id}).$promise.then(res => {
          let bcWithLatestBuild = res.data[0];
          if (bcWithLatestBuild.latestBuild) {
            updateBuild(bcWithLatestBuild);
          }
        });
      }

      $scope.$on(events.BUILD_STATUS_CHANGED, (event, build) => {
        if ($ctrl.buildConfig.id === build.buildConfigRevision.id) {
          $ctrl.build = build;
        }
      });
    };
  }
})();
