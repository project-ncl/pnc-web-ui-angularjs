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

  angular.module('pnc.dashboard').component('pncMyGroupBuildsPanel', {
    bindings: {
      groupBuilds: '<',
    },
    templateUrl: 'dashboard/directives/pnc-my-group-builds-panel/pnc-my-group-builds-panel.html',
    controller: ['$scope', 'authService', 'GroupBuildResource', 'events', 'filteringPaginator', 'SortHelper', Controller]
  });

  function Controller($scope, authService, GroupBuildResource, events, filteringPaginator, SortHelper) {
    const $ctrl = this;

    const PAGE_NAME = 'myGroupBuildsPanel';

    const DEFAULT_FIELDS = ['status', 'id', 'configurationName', 'startTime', 'endTime'];

    $ctrl.displayFields = DEFAULT_FIELDS;

    // -- Controller API --
    $ctrl.groupBuildsFilteringFields = [{
      id: 'groupConfig.name',
      title: 'Group Config name',
      placeholder: 'string | !string | s?ring | st*ng',
      filterType: 'text'
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
    }, {
      id: 'temporaryBuild',
      title: 'Temporary Build',
      placeholder: 'Filter by Temporary Build',
      filterType: 'select',
      filterValues: [
        'FALSE',
        'TRUE'
      ]
    }];

    $ctrl.groupBuildsSortingFields = [{
      id: 'status',
      title: 'Status',
    }, {
      id: 'groupConfig.name',
      title: 'Build Config',
    }, {
      id: 'startTime',
      title: 'Start Time'
    }, {
      id: 'endTime',
      title: 'End Time',
    }];

    $scope.show = function() {
      return authService.isAuthenticated();
    };

    $ctrl.$onInit = () => {
      $ctrl.groupBuildsSortingConfigs = SortHelper.getSortConfig(PAGE_NAME);
      $ctrl.groupBuildsFilteringPageForFiltering = filteringPaginator(GroupBuildResource.query(), null, '127');
      authService.getPncUser().then(result => {
        let initialPage = GroupBuildResource.queryByUser({
          userId: result.id,
          pageSize: 10,
          sort: '=desc=startTime'
        });
        $ctrl.groupBuildsFilteringPage = filteringPaginator(initialPage);
      });

      $scope.$on(events.GROUP_BUILD_PROGRESS_CHANGED, (event, groupBuild) => {
        if (authService.isCurrentUser(groupBuild.user)) {
          $ctrl.groupBuildsFilteringPage.refresh();
        }
      });
    };

  }

})();
