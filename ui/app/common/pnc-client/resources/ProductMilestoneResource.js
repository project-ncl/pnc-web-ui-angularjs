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

  var module = angular.module('pnc.common.pnc-client.resources');

  module.value('PRODUCT_MILESTONES_PATH', '/product-milestones/:id');

  module.factory('ProductMilestoneResource', [
    '$resource',
    'restConfig',
    'PRODUCT_MILESTONES_PATH',
    'patchHelper',
    ($resource, restConfig, PRODUCT_MILESTONES_PATH, patchHelper) => {
      const ENDPOINT = restConfig.getPncRestUrl() + PRODUCT_MILESTONES_PATH;

      const resource = $resource(ENDPOINT, {
        id: '@id'
      },
      {
        query: {
          method: 'GET',
          isPaged: true,
        },
        save: {
          method: 'POST',
          successNotification: 'Product Milestone created'
        },
        update: {
          method: 'PUT',
          successNotification: 'Product Milestone updated'
        },

        // Gets builds performed during a product milestone cycle.
        queryPerformedBuilds: {
          method: 'GET',
          url: ENDPOINT + '/builds',
          isPaged: true
        },

        queryCloseResults: {
          method: 'GET',
          url: ENDPOINT + '/close-results',
          isPaged: true,
          params: {
            sort: '=desc=startingDate'
          }
        },

        getLatestCloseResult: {
          method: 'GET',
          url: ENDPOINT + '/close-results?latest=true'
        },

        close: {
          method: 'POST',
          url: ENDPOINT + '/close',
          successNotification: 'Product Milestone close process started',
          interceptor: { response: r => r.data }
        },

        analyzeDeliverables: {
          method: 'POST',
          url: ENDPOINT + '/analyze-deliverables',
          successNotification: 'Analysis of deliverables process started',
        },

        validateVersion: {
          method: 'POST',
          url: ENDPOINT + '/validate-version',
          successNotification: false
        },

        getDeliveredArtifacts: {
          method: 'GET',
          url: ENDPOINT + '/delivered-artifacts',
          isPaged: true,
          successNotification: false
        }
      });

      patchHelper.assignPatchMethods(resource);

      return resource;
    }

  ]);

})();
