# angular-mock-record
An angular 4+ framework that mocks and records requests. Requests can be manually mocked or recorded like VCR.

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


- Then mock requests in beforeEach or beforeAll:


`
beforeAll(() => {
  mockUtilities.mockRequest('path/yourRequest.json', {foo: 'bar'});
)};
`

- Next run tests in the describe block:


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
