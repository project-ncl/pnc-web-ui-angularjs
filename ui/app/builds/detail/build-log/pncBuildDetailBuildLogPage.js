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

  angular.module('pnc.builds').component('pncBuildDetailBuildLogPage', {
    bindings: {
      build: '<',
      buildLog: '<',
      sshCredentials: '<'
    },
    templateUrl: 'builds/detail/build-log/pnc-build-detail-build-log-page.html',
    controller: ['authService', Controller]
  });


  function Controller(authService) {
    const $ctrl = this;

    // -- Controller API --
    $ctrl.logFileName = null;
    $ctrl.sshCredentialsBtn = {
      clicked: false
    };

    // --------------------

    $ctrl.$onInit = function () {
      $ctrl.logFileName = $ctrl.build.id + '_' + $ctrl.build.buildConfigRevision.name + '_' + $ctrl.build.status + '.txt';
      $ctrl.isCurrentUser = authService.isCurrentUser($ctrl.build.user);
      $ctrl.isSuperUser = authService.isSuperUser();
    };

  }

})();
