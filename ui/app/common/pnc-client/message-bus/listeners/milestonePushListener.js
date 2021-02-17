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

  angular.module('pnc.common.pnc-client.message-bus').factory('milestonePushListener', [
    '$rootScope',
    '$state',
    'pncNotify',
    'ProductMilestoneResource',
    function ($rootScope, $state, pncNotify, ProductMilestoneResource) {

      function notify(result) {

        function navigateToPushResult() {
          $state.go('products.detail.product-versions.detail.milestone.detail.close-result', { productMilestoneId: result.milestone.id,
            closeResultId: result.id });
        }

        function doNotify(type, message) {
          pncNotify[type](message, 'View Result', navigateToPushResult);
        }

        switch(result.status) {
          case 'SUCCESS':
            doNotify('success', 'Milestone close process completed for version: ' + result.milestone.$version());
            break;
          case 'FAILED':
          case 'SYSTEM_ERROR':
            doNotify('error', 'Milestone close process failed for version: ' + result.milestone.$version());
            break;
          case 'CANCELED':
            doNotify('info', 'Milestone close process cancelled for build: ' + result.milestone.$version());
        }
      }

      return function (message) {
        if (message.eventType === 'PRODUCT_MILESTONE_CLOSE_RESULT') {
          $rootScope.$broadcast('PRODUCT_MILESTONE_CLOSE_RESULT', message);
          if (message.id) {
            ProductMilestoneResource.get({ id: message.milestone.id }).$promise.then(function (message) {
              notify(message);
            });
          }
        }
      };
    }
  ]);

})();
