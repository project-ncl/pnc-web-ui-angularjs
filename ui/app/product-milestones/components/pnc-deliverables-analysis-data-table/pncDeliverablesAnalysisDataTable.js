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

  angular
    .module('pnc.product-milestones')
    .component('pncDeliverablesAnalysisDataTable', {
      bindings: {
        /**
         * Array: The list of deliverables analysis to display in the table
         */
        deliverablesAnalysis: '<',
      },
      templateUrl:
        'product-milestones/components/pnc-deliverables-analysis-data-table/pnc-deliverables-analysis-data-table.html',
      controller: ['filteringPaginator', 'SortHelper', Controller],
    });

  function Controller(filteringPaginator, SortHelper) {
    const $ctrl = this;

    const PAGE_NAME = 'deliverablesAnalysisDataTable';

    // -- Controller API --

    $ctrl.filteringFields = [
      {
        id: 'progressStatus',
        title: 'Status',
        placeholder: 'Filter by Status',
        filterType: 'select',
        filterValues: ['NEW', 'IN_PROGRESS', 'FINISHED'],
      },
      {
        id: 'result',
        title: 'Result',
        placeholder: 'Filter by Result',
        filterType: 'select',
        filterValues: ['SUCCESSFUL', 'FAILED', 'SYSTEM_ERROR'],
      },
      {
        id: 'user.username',
        title: 'User',
        placeholder: 'string | !string | s?ring | st*ng',
        filterType: 'text'
      }
    ];

    $ctrl.sortingFields = [
      {
        id: 'submitTime',
        title: 'Submit Time',
      },
    ];

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.filteringPage = filteringPaginator($ctrl.deliverablesAnalysis);

      $ctrl.sortingConfigs = SortHelper.getSortConfig(PAGE_NAME);
    };
  }
})();
