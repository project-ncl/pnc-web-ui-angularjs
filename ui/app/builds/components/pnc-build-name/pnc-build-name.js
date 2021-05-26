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

  angular.module('pnc.builds').component('pncBuildName', {
    bindings: {
      build: '<',
      longName: '@?',
      link: '@?',
      text: '@?'
    },
    transclude: true, //verify
    templateUrl: 'builds/components/pnc-build-name/pnc-build-name.html',
    controller: ['utils', Controller]
  });

  function Controller(utils) {
    const $ctrl = this;

    $ctrl.$onInit = () => {
      setName();
    };

    function setName() {
      $ctrl.buildName = utils.getBuildName($ctrl.build);
      $ctrl.buildConfigName = $ctrl.build.buildConfigRevision.name;
    }
    
  }
})();