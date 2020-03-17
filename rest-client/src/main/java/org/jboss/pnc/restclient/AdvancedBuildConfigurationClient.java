/**
 * JBoss, Home of Professional Open Source.
 * Copyright 2014-2019 Red Hat, Inc., and individual contributors
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
package org.jboss.pnc.restclient;

import static org.jboss.pnc.restclient.websocket.predicates.BuildChangedNotificationPredicates.withBuildCompleted;
import static org.jboss.pnc.restclient.websocket.predicates.BuildChangedNotificationPredicates.withBuildId;

import java.util.concurrent.CompletableFuture;

import org.jboss.pnc.client.BuildConfigurationClient;
import org.jboss.pnc.client.Configuration;
import org.jboss.pnc.client.RemoteResourceException;
import org.jboss.pnc.dto.Build;
import org.jboss.pnc.dto.notification.BuildChangedNotification;
import org.jboss.pnc.rest.api.parameters.BuildParameters;
import org.jboss.pnc.restclient.websocket.VertxWebSocketClient;
import org.jboss.pnc.restclient.websocket.WebSocketClient;

public class AdvancedBuildConfigurationClient extends BuildConfigurationClient implements AutoCloseable {

    private WebSocketClient webSocketClient;

    public AdvancedBuildConfigurationClient(Configuration configuration) {
        super(configuration);
        this.webSocketClient = new VertxWebSocketClient();
        webSocketClient.connect("ws://" + configuration.getHost() + "/pnc-rest-new/notification");
    }

    public CompletableFuture<Build> waitForBuild(String buildId) {
        return webSocketClient.catchBuildChangedNotification(withBuildId(buildId), withBuildCompleted())
                .thenApply(BuildChangedNotification::getBuild);
    }

    public CompletableFuture<Build> executeBuild(String buildConfigId, BuildParameters parameters)
            throws RemoteResourceException {
        Build build = super.trigger(buildConfigId, parameters);
        return waitForBuild(build.getId());
    }

    @Override
    public void close() throws Exception {
        webSocketClient.disconnect().get();
    }
}