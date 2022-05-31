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

  angular.module('pnc.product-milestones').component('pncProductMilestoneAnalyzeDeliverablesPage', {
    bindings: {
      productMilestone: '<',
      hideHeader: '<'
    },
    templateUrl: 'product-milestones/analyze-deliverables/pnc-product-milestone-analyze-deliverables-page.html',
    controller: ['$state', 'ProductMilestoneResource', Controller]
  });

  function Controller($state, ProductMilestoneResource) {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.analyze = analyze;

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.data = $ctrl.productMilestone;
    };

    function analyze(deliverablesUrls) {
      ProductMilestoneResource.analyzeDeliverables({ id: $ctrl.data.id }, {
        deliverablesUrls: deliverablesUrls.split('\n') // parse URLs into array
      }, (response) => {
        // TODO redirect: $state.go(...)
        console.log('response: ', response);
      }, (error) => {
        console.error(error);
      });
    }

  }

})();
