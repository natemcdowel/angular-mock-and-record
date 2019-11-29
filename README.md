![Logo](logo.png)

# An Angular 4+ framework that records, replays, and stubs HTTP interactions.

# Installation
- Run `npm install angular-mock-record`
- Create a `mock.record.config.json` file in the root of your Angular app:


```json
{
  "domain": "http://your.api.domain",
  "port": 3000,
  "cors": false,
  "tape_name": "vcr",
  "proxied_mock_server_route": "/e2e",
  "request_headers": [
    "X-XSRF-TOKEN",
    "cookie"
  ],
  "recording_dir": "./e2e/mocks",
  "allow_recording": false,
  "exclude_params": [],
  "normalize_params": []
}
```


# Mocking
- Import in the protractor spec file:


`import { MockUtilities } from 'angular-mock-record/client/mock.utilities';`


- Then, mock requests in beforeEach or beforeAll:


`
beforeAll(() => {
  mockUtilities.mockRequest('path/yourRequest.json', {foo: 'bar'});
)};
`

- Next, run tests in the describe block:


`
it('should have the mocked request data', () => {
  expect(page.getFoo().getText()).toContain('bar');
});
`


- Finally, be sure to clearMocks before moving to a new describe:

`
afterAll(() => {
  mockUtilities.clearMocks();
});
`
# Setting up mock.record.config.json for recording

- Set `domain` as the request path that will be used to make requests and record.
- Set an array of params that need to be excluded from request url matching via `exclude_params`. Ex: `exclude_params: ['sort']`
- Set an array of params that need to be normalized in request url via `normalize_params`. Ex: `normalize_params: ['randomly_generated_id']`
- Set `allow_recording` to true to fail when a new recording is detected. This is handy for continuous integration tools such as Travis CI.

# Functionality

- To set the client to login as (If not specified, product demo a is the default):
  `mockUtilities.setClient( clientOverride.getClientDomain(<client>) );`

- To login and record authenticated requests, use:
  `mockUtilities.login(<user from idp auth>);`

- To set a "context" and limit new recordings to the scope of that context:
  `mockUtilities.setContext(<name of context>);`

- As usual, clear the mocks in the afterAll block at the end of the spec file. This will also reset context, client and login status:
  `mockUtilities.clearMocks();`


# Running the server

- Run `node ./node_modules/angular-mock-record/server/server.js allow_recording`
- Hit `http://localhost:<port>/<api_path>` in a browser to test the recording functionality.  Once recorded, requests matching this URL will return the captured recording.
- Finally, set up your application's E2E endpoint configuration to point to `http://localhost:<port>/<api_path>`. Start the server, then run `ng e2e`.  All requests will be recorded unless they are otherwise mocked.

# Publishing to NPM

- bump the version number in package.json
- run `npm publish` locally
