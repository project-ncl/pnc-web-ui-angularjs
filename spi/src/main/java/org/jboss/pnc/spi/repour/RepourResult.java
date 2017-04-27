/**
 * JBoss, Home of Professional Open Source.
 * Copyright 2014 Red Hat, Inc., and individual contributors
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
package org.jboss.pnc.spi.repour;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jboss.pnc.spi.coordinator.CompletionStatus;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author <a href="mailto:matejonnet@gmail.com">Matej Lazar</a>
 */
@AllArgsConstructor
@XmlRootElement
public class RepourResult {

    @Getter
    private final CompletionStatus completionStatus;

    @Getter
    private final String log;

    @Getter
    private final String executionRootName;

    @Getter
    private final String executionRootVersion;

}
