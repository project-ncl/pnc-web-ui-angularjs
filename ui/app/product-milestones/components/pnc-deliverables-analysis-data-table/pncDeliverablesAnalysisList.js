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
    .component('pncDeliverablesAnalysisList', {
      bindings: {
        /**
         * Array: The list of deliverables analysis to display in the table
         */
        deliverablesAnalysisList: '<',
      },
      templateUrl:
        'product-milestones/components/pnc-deliverables-analysis-data-table/pnc-deliverables-analysis-list.html',
      controller: [Controller],
    });

  function Controller() {
    const $ctrl = this;
    $ctrl.hasData = false;

    // -- Controller API --

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.hasData = $ctrl.deliverablesAnalysisList && $ctrl.deliverablesAnalysisList.length > 0;
    };
  }
})();
