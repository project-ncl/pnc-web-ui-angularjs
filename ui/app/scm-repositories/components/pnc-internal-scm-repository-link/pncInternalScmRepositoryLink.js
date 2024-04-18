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
    const preDefinedScmsPrefix = {
      gitlab: 'GitLab',
      code: 'Gerrit'
    };

    // Regular expression to match 'git://','git+ssh://', 'http://', 'https://', 'git@', and 'ssh://git@'
    const protocolRegex =
    /^(git:\/\/|git\+ssh:\/\/|http:\/\/|https:\/\/|git@|ssh:\/\/git@)/;

    /**
     * Parses internal repo url to Gerrit gitweb or Gitlab link of the project
     */
    function parseInternalRepoLink() {
      let url = $ctrl.internalScmRepositoryUrl;
      const protocolMatch = url.match(protocolRegex);
      const protocol = protocolMatch ? protocolMatch.at(1) : '';

      let webUrl = protocol === 'git@' ? url.replace(':', '/') : url;
      const base = webUrl.split(protocol).at(1).split('/').at(0);

      // Find the first prefix in preDefinedScmsPrefix that matches the start of base
      const namePrefixKey = Object.keys(preDefinedScmsPrefix).find((key) => base.startsWith(key));
      const name = namePrefixKey ? preDefinedScmsPrefix[namePrefixKey] : base;

      // Special handling for URLs from Gerrit, will be removed after Gerrit support ends.
      const matchedGerritUrl = Object.keys(preDefinedScmsPrefix).find(
        (key) => key.includes(base) && preDefinedScmsPrefix[key] === 'Gerrit'
      );
      if (matchedGerritUrl) {
        const path = url.split(matchedGerritUrl).at(1);
        const replaceRegex = path.startsWith('/gerrit/') ? /^\/gerrit\// : /^\//;
        webUrl = `https://${matchedGerritUrl}/gerrit/gitweb?p=${path.replace(
          replaceRegex,
          ''
        )};a=summary`;
      } else {
        webUrl = webUrl.replace(protocol, 'https://');
      }

      return { scmRepositoryUrl: url, webUrl, name };
    }
  }



})();
