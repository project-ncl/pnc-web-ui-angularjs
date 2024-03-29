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
(function() {
  'use strict';

  angular.module('pnc.product-milestones').component('pncProductMilestoneCloseResultPage', {
    bindings: {
      /**
       * Page: the page of close result objects to display.
       */
      closeResult: '<'
    },
    templateUrl: 'product-milestones/close-result/pnc-product-milestone-close-result-page.html',
    controller: ['$scope', Controller]
  });

  function Controller($scope) {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.showTable = showTable;

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.data = $ctrl.closeResult.data[0];

      $ctrl.prefixFilters = 'loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_';
      $ctrl.matchFilters = `level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:${$ctrl.data.id}`;

      $scope.$on('MILESTONE_PUSH_STATUS_CHANGE', (event, milestonePushResult) => {
        $scope.$applyAsync(() => load(milestonePushResult));
      });
    };

    function showTable() {
        return $ctrl.data.buildPushResults && $ctrl.data.buildPushResults.length;
    }

    function load(milestonePushResult) {
      if (milestonePushResult) {
        $ctrl.data = milestonePushResult;
        $ctrl.matchFilters = `level.keyword:INFO|ERROR|WARN,mdc.processContext.keyword:${$ctrl.data.id}`;
      }
    }
  }

})();
