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

  angular.module('pnc.dashboard').component('pncMyBuildsPanel', {
    templateUrl: 'dashboard/directives/pnc-my-builds-panel/pnc-my-builds-panel.html',
    controller: ['$scope', 'authService', 'BuildResource', 'events', 'filteringPaginator', 'SortHelper', Controller]
  });

  function Controller($scope, authService, BuildResource, events, filteringPaginator, SortHelper) {
    const $ctrl = this;

    const PAGE_NAME = 'myBuildsPanel';

    const DEFAULT_FIELDS = ['status', 'id', 'configurationName', 'startTime', 'endTime'];

    $ctrl.displayFields = DEFAULT_FIELDS;

    // -- Controller API --
    $ctrl.buildsFilteringFields = [{
      id: 'buildConfigName',
      title: 'Build Config name',
      placeholder: 'string | !string | s?ring | st*ng',
      filterType: 'text',
      filterMethod: 'QUERY_PARAM'
    }, {
      id: 'status',
      title: 'Status',
      placeholder: 'Filter by Status',
      filterType: 'select',
      filterValues: [
        'SUCCESS',
        'REJECTED',
        'FAILED',
        'CANCELLED',
        'BUILDING'
      ]
    }];

    $ctrl.buildsSortingFields = [{
      id: 'status',
      title: 'Status',
    }, {
      id: 'submitTime',
      title: 'Submit Time'
    }, {
      id: 'startTime',
      title: 'Start Time'
    }, {
      id: 'endTime',
      title: 'End Time',
    }];

    $ctrl.show = () => {
      return authService.isAuthenticated();
    };

    $ctrl.$onInit = () => {
      if (authService.isAuthenticated()) {
        $ctrl.buildsSortingConfigs = SortHelper.getSortConfig(PAGE_NAME);
        authService.getPncUser().then(result => {
          BuildResource.query({
            q: 'user.id=='+result.id,
            pageSize: 10,
            sort: '=desc=submitTime'
          }).$promise.then(page =>{
            page.userId = result.id;
            $ctrl.buildsFilteringPage = filteringPaginator(page);
          });
        });

        $scope.$on(events.BUILD_PROGRESS_CHANGED, (event, Build) => {
          if (authService.isCurrentUser(Build.user)) {
            $ctrl.buildsFilteringPage.refresh();
          }
        });
      }
    };

  }

})();
