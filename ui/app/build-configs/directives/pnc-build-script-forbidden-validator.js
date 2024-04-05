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
'use strict';

(function () {

  var module = angular.module('pnc.build-configs');

  /**
   * Check whether Build Script input is not containing forbidden commands.
   */
  module.directive('pncBuildScriptForbiddenValidator', function () {

      var buildScriptForbiddenChecker = function(value) {
        const MAVEN = 'mvn';
        const FORBIDDEN_ARGS = [` -X `, ` "-X" `, ` '-X' `, ` --debug `, ` "--debug" `, ` '--debug' `];
        
        const lines = value.toLowerCase().split('\n');
        return lines.every((line) => {
          if (!line.includes(MAVEN)) {
            return true;
          }
          const lineWithEndSpace = ' ' + line + ' ';
          return FORBIDDEN_ARGS.every((arg) => (!lineWithEndSpace.includes(arg.toLowerCase())));
        });
      };

      return {
        restrict: 'A',
        require: 'ngModel',

        link: function(scope, ele, attrs, ctrl){
          ctrl.$validators.forbiddenBuildScript = function(value) {
            return !value || buildScriptForbiddenChecker(value);
          };

        }


      };
    }
  );

})();
