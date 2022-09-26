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

  var module = angular.module('pnc.product-milestones', [
    'ui.router',
    'ui.bootstrap',
    'patternfly',
    'pnc.common.util'
  ]);

  module.config(['$stateProvider', function ($stateProvider) {

    $stateProvider

      .state('products.detail.product-versions.detail.milestone', {
        abstract: true,
        url: '/milestones',
        views: {
          'content@': {
            templateUrl: 'common/templates/single-col.tmpl.html'
          }
        },
        data: {
          proxy: 'products.detail.product-versions.detail'
        }
      })

      .state('products.detail.product-versions.detail.milestone.detail', {
        url: '/{productMilestoneId}',
        redirectTo: 'products.detail.product-versions.detail.milestone.detail.default',
        component: 'pncProductMilestoneDetailPage',
        data: {
          displayName: '{{ productMilestone.version }}',
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone'
        },
        resolve: {
          productMilestone: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) =>
            ProductMilestoneResource.get({ id: $stateParams.productMilestoneId }).$promise
          ],
          deliveredArtifacts: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) => 
            ProductMilestoneResource.getDeliveredArtifacts({ id: $stateParams.productMilestoneId, pageSize: 1 }).$promise
          ],
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.default', {
        url: '/',
        component: 'pncProductMilestoneDetailDetailsTab',
        data: {
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone',
          displayName: 'Details',
        },
        resolve: {
          closeResults: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) =>
            ProductMilestoneResource.getLatestCloseResult({ id: $stateParams.productMilestoneId }).$promise
          ]
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.builds-performed-tab', {
        url: '/build-performed',
        component: 'pncProductMilestoneDetailBuildsPerformedTab',
        data: {
          displayName: 'Builds Performed',
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone | Builds Performed'
        },
        resolve: {
          performedBuilds: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) =>
            ProductMilestoneResource.queryPerformedBuilds({ id: $stateParams.productMilestoneId }).$promise
          ]
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.close-results-tab', {
        url: '/close-results',
        component: 'pncProductMilestoneCloseResultsTab',
        data: {
          displayName: 'Close Result',
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone | Close Result'
        },
        resolve: {
          closeResults: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) =>
            ProductMilestoneResource.queryCloseResults({ id: $stateParams.productMilestoneId }).$promise
          ]
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.delivered-artifacts-tab', {
        url: '/delivered-artifacts',
        component: 'pncProductMilestoneDetailDeliveredArtifactsTab',
        data: {
          displayName: 'Delivered Artifacts',
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone | Delivered Artifacts'
        },
        resolve: {
          deliveredArtifacts: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) => 
            ProductMilestoneResource.getDeliveredArtifacts({ id: $stateParams.productMilestoneId }).$promise
          ],
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.deliverables-analysis-tab', {
        url: '/deliverables-analysis',
        component: 'pncProductMilestoneDetailDeliverablesAnalysisTab',
        data: {
          displayName: 'Deliverables Analysis',
          title: '{{ productMilestone.version }} | {{ product.name }} | Milestone | Deliverables Analysis'
        },
        resolve: {
          deliverablesAnalysis: [
            'ProductMilestoneResource',
            'SortHelper',
            '$stateParams',
            (ProductMilestoneResource, SortHelper, $stateParams) =>
              ProductMilestoneResource.getDeliverablesAnalyzerOperations(
                Object.assign(
                  { id: $stateParams.productMilestoneId },
                  SortHelper.getSortQueryString('deliverablesAnalysisDataTable')
                )
              ).$promise,
          ],
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.deliverables-analysis-details', {
        url: '/deliverables-analysis/{deliverablesAnalysisId}',
        component: 'pncProductMilestoneDeliverablesAnalysisDetailsPage',
        data: {
          displayName: 'Deliverables Analysis {{deliverablesAnalysisId}}',
          title: 'Deliverables Analysis {{deliverablesAnalysisId}}'
        },
        resolve: {
          deliverablesAnalysisId: [ '$stateParams', ($stateParams) => $stateParams.deliverablesAnalysisId ],
          deliverablesAnalysis: ['OperationResource', '$stateParams', (OperationResource, $stateParams) =>
            OperationResource.get({ id: $stateParams.deliverablesAnalysisId }).$promise
          ],
        }
      })
      .state('products.detail.product-versions.detail.milestone.detail.log', {
        url: '/log',
        component: 'pncProductMilestoneDetailLogPage',
        data: {
          displayName: 'Workflow Log',
          title: '{{ productMilestone.version }} | {{ product.name }} | Workflow Log'
        }
      })

      .state('products.detail.product-versions.detail.milestone.create', {
        url: '/create',
        component: 'pncProductMilestoneCreateUpdatePage',
        data: {
          displayName: 'Create Milestone',
          title: '{{ productVersion.version }} | {{ product.name }} | Create Milestone',
          requireAuth: true
        },
        resolve: {
          productMilestone: [function() { return null; }]
        },
      })

      .state('products.detail.product-versions.detail.milestone.detail.update', {
        url: '/update',
        component: 'pncProductMilestoneCreateUpdatePage',
        data: {
          displayName: 'Update Milestone',
          title: '{{ productMilestone.version }} | {{ product.name }} | Update Milestone',
          requireAuth: true
        },
        params: {
          hideHeader: {
            value: true,
            type: 'bool'
          }
        },
        resolve: {
          hideHeader: ['$stateParams', ($stateParams) => $stateParams.hideHeader]
        },
      })

      .state('products.detail.product-versions.detail.milestone.detail.close', {
        url: '/close',
        component: 'pncProductMilestoneClosePage',
        data: {
          displayName: 'Close Milestone',
          title: '{{ productMilestone.version }} | {{ product.name }} | Close Milestone',
          requireAuth: true
        },
        params: {
          hideHeader: {
            value: true,
            type: 'bool'
          }
        },
        resolve: {
          hideHeader: ['$stateParams', ($stateParams) => $stateParams.hideHeader]
        },
      })

      .state('products.detail.product-versions.detail.milestone.detail.close-result', {
        url: '/close-results/{closeResultId}',
        views: {
          'content@': {
            component: 'pncProductMilestoneCloseResultPage'
          }
        },
        data: {
          displayName: 'Close Result',
          title: 'Close Result | {{ productMilestone.version }} | {{ product.name }} '
        },
        resolve: {
          closeResult: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) =>
          ProductMilestoneResource.queryCloseResults({ id: $stateParams.productMilestoneId, q: 'id==' + $stateParams.closeResultId }).$promise
          ],
          productMilestone: ['ProductMilestoneResource', '$stateParams', (ProductMilestoneResource, $stateParams) => 
            ProductMilestoneResource.get({id: $stateParams.productMilestoneId }).$promise
          ]
        }
      })
      
      .state('products.detail.product-versions.detail.milestone.detail.analyze-deliverables', {
        url: '/analyze-deliverables',
        component: 'pncProductMilestoneAnalyzeDeliverablesPage',
        data: {
          displayName: 'Analyze Deliverables',
          title: '{{ productMilestone.version }} | {{ product.name }} | Analyze Deliverables',
          requireAuth: true
        },
        params: {
          hideHeader: {
            value: true,
            type: 'bool'
          }
        },
        resolve: {
          hideHeader: ['$stateParams', ($stateParams) => $stateParams.hideHeader]
        },
      });

  }]);

})();
