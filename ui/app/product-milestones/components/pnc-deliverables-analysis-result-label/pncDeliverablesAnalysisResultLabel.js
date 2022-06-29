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

  angular.module('pnc.product-milestones').component('pncDeliverablesAnalysisResultLabel', {
    bindings: {
      /**
       * Array: The specific deliverableAnalysis of the result label to be displayed
       */
      deliverableAnalysis: '<'
    },
    templateUrl: 'product-milestones/components/pnc-deliverables-analysis-result-label/pnc-deliverables-analysis-result-label.html',
    controller: [Controller]
  });

  function Controller() {
    const $ctrl = this;

    // -- Controller API --


    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.label = $ctrl.deliverableAnalysis.result;

      $ctrl.labelClasses = ['label'];

      switch ($ctrl.label) {
        case 'SUCCESSFUL':
          $ctrl.labelClasses.push('label-success');
          break;
        case 'FAILED':
          $ctrl.labelClasses.push('label-warning');
          break;
        case 'SYSTEM_ERROR':
          $ctrl.labelClasses.push('label-danger');
          break;
        default:
          $ctrl.labelClasses.push('label-default');
      }

      $ctrl.$onChanges = (changes) => {
        if (changes && changes.deliverableAnalysis) {
          $ctrl.$onInit();
        }
      };
    };
  }

})();
