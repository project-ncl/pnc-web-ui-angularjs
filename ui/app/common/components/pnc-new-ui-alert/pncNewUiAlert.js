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

  /**
   * The component for global-screen new UI notification
   */
  angular.module('pnc.common.components').component('pncNewUiAlert', {
    bindings: {},
    templateUrl:
      'common/components/pnc-new-ui-alert/pnc-new-ui-alert.html',
    controller: ['pncProperties', Controller],
  });

  function Controller(pncProperties) {
    var $ctrl = this;
    $ctrl.newUiUrl = pncProperties.pncNewUIUrl;

    // -- Controller API --

    // --------------------
  }
})();
