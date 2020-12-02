// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <msalConfigSnippet>
const msalConfig = {
  auth: {
    clientId: 'b92f9379-9e28-4076-9ba1-5546b988b1b6',
    redirectUri: 'http://localhost:8080'
  }
};

const msalRequest = {
  scopes: [
    'user.read',
    'notes.read'
  ]
}
// </msalConfigSnippet>
