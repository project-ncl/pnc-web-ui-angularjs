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

  angular.module('pnc.scm-repositories').component('pncInternalScmRepositoryLink', {
    bindings: {
      internalScmRepositoryUrl: '<'
    },
    templateUrl: 'scm-repositories/components/pnc-internal-scm-repository-link/pnc-internal-scm-repository-link.html',
    controller: [Controller]
  });

  function Controller() {
    const $ctrl = this;

    // -- Controller API --

    $ctrl.parseInternalRepoLink = parseInternalRepoLink;

    // --------------------

    /**
     * Parses internal repo url to Gerrit gitweb link of the project
     */
    function parseInternalRepoLink() {
      let url = $ctrl.internalScmRepositoryUrl;
      let protocol = url.split('://')[0];
      let base = url.split('://')[1].split('/')[0];
      let project = url.split(base + (['https', 'http'].includes(protocol) ? '/gerrit/' : '/'))[1];
      return 'https://' + base + '/gerrit/gitweb?p=' + project + ';a=summary';
    }
  }



})();
