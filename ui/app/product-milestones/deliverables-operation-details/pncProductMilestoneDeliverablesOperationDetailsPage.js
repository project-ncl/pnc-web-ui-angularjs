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
  "use strict";

  angular
    .module("pnc.product-milestones")
    .component("pncProductMilestoneDeliverablesOperationDetailsPage", {
      bindings: {
        /**
         * deliverablesOperation: the deliverables operation object to display.
         */
        deliverablesOperation: "<",
      },
      templateUrl:
        "product-milestones/deliverables-operation-details/pnc-product-milestone-deliverables-operation-details-page.html",
      controller: ["$scope", Controller],
    });

  function Controller($scope) {
    const $ctrl = this;

    // -- Controller API --

    // --------------------

    $ctrl.$onInit = () => {
      $ctrl.data = $ctrl.deliverablesOperation;

      $ctrl.prefixFilters =
        "loggerName.keyword:org.jboss.pnc.causeway|org.jboss.pnc._userlog_,level.keyword:INFO|ERROR|WARN";
      $ctrl.matchFilters = `mdc.processContext:${$ctrl.data.id}`;
    };
  }
})();
