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

  angular.module('pnc.artifacts').component('pncArtifactsDetailPage', {
    bindings: {
     artifact: '<',
     build: '<',
     usages: '<',
     revisions: '<',
     milestones: '<'
    },
    templateUrl: 'artifacts/detail/pnc-artifacts-detail-page.html',
    controller: ['ArtifactModals', Controller]
  });


  function Controller(ArtifactModals) {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.editQuality = editQuality;

    // --------------------


    $ctrl.$onInit = () => {
      $ctrl.buildListDisplayFields = ['statusIcon', 'canonicalName', 'endTime', 'pushStatus'];
    };


    function editQuality() {
      return ArtifactModals.newArtifactQualityModal($ctrl.artifact)
          .result
          .then(updatedArtifact => $ctrl.artifact = updatedArtifact);
    }

  }

})();
