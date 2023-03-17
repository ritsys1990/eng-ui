# Requirements

- You need to be connected to the Deloitte network in order to access dev environments for services. This can be
  achieved by running the **DeloitteNet VPN** app in your Windows computer.
- Node (The recommended version is **10.15.3**)

# Setup

- Clone the repo and checkout the appropriate branch.
- [Setup the .npmrc file](https://symphonyvsts.visualstudio.com/Audit%20Cortex/_wiki/wikis/Audit-Cortex.wiki/12756/Create-.npmrc-file-for-your-UI-Project)
  with our wiki.
- Open a terminal on the root folder and run `npm install`, this will install all the required dependencies.
- To run the project, run `npm run start`, this will start the application on port 3000.

## Scripts

1. `build`: Builds the npm library including a generated package.json in dist directory.
2. `start`: Builds and watches the module.
3. `watch`: Watches only the module.
4. `test`: Runs the unit tests affected by the modified files since last commit.
5. `test-all`: Runs all the unit tests in the project.
6. `test-clear`: Clears the jest cache and runs the unit tests affected by the modified files since last commit.
7. `test-coverage`: Generates the code cverage report and stores it in the `coverage` folder.
8. `lint`: Runs ESLint on all the files of the project and reports all the errors and warnings found.

# Integration with Cortex Look Book EngagementUI utilizes the cortex-look-book package to build its components. If your

`engagement-ui` and `cortex-look-book` repos are on the same folder, Engagement UI will use the latest build of your
local look-book repo for the components, otherwise its going to use the version installed in your `node_modules`.

# Connecting to an environment Engagement UI has different configurations depending on what environment you want to run

your local project. It can be configured to run using the services and DB from DEV or DEV1 environments. This config
files are located in `engagement-ui/config/<environment>.json`. In order to let the project know what config file to
use, we have a flag called `STAGE` that we set in the `start` script of the `package.json`, allowing you to do
`STAGE=dev` in order to use the `dev.json` config file.

# Guidelines

## Redux

- action name: `<NOUN>_<VERB>`
- action creator name: `<verb><Noun>`
- selector name: `select<Noun>`
- reducer name: `<noun>Reducer`

## General

- There should be no build warnings or errors.
- Code should be validated with `ESLint` and there should be a total of 0 errors and warnings.
- Code must be covered with unit test, min 75% test coverage.
- Always add error handling for failure scenarios, and ensure the user is notified of the error.
- Comments should be added only to "hard to understand" code. Try to avoid this cases.

## Code Style

- Use PropTypes.
- Remove commented code.
- All components should be functional components and they should be as generic, modular and should perform one function.
  At max 150 lines of code. This will make our code more readable,
- Place properties up top followed by methods.
- Place internal methods after hooks, alphabetized.
- Avoid passing too many attributes or arguments. Limit yourself to five props that you pass into your component.
- Avoid having large classes, methods or components, including Reducers.

## Design

- Stick to KISS and SOLID principles.
- Use Redux to manage application state.
- Keep components function-specific and reusable (if possible).
- Render function should not contain business logic.
- Styled components should be defined in a separate file.
- All pure UI components should come from look-book, this means: components that doesn't require services, that are
  reusable, like ui controls, displays, progress bar, everything you normally get from a UI framework.
- Engagement UI components are fully feature components, that may have look-book components implemented inside.
- Make sure you use localized strings for any static text.

# Testing We are using the Jest + Enzyme libraries in order to write meaningful unit tests in our project, and ensure

quality. Each new component should have at least 85% code coverage.

## Running tests In order to run the tests, you should run the command `npm run test`

## Checking code coverage To check code coverage, run the command `npm run test-coverage`. This will generate a folder

named 'coverage' inside the engagement ui repo. This command will also generate a HTML view of the code coverage for all
the files, in order to access it go to **engagement-ui/coverage/lcov-report/index.html**

## What are we testing? We will test:

- happy path
- basic component rendering
- reducers
- thunks
- methods, which return data in utils or services.
- how component reacts on events
- component methods which:
  - will return data
  - change local component state

We will NOT test:

- Snapshots
- Flow, we do not write integration or e2e tests.
- If component is HOC, or just a Layout component, skip test for it, because you already wrote tests for it's children.

# Examples Write meaningful variable/function names. Function name should begins with a verb. One-character variable

names should be avoided except for temporary "throwaway" variables. Common names for temporary variables are i, j, k, m,
and n for integers; c, d, and e for characters.

```javascript
Good: const judgementsList = [];
const getJudgementById = (list, judgementId) => {};

Bad: const jItems = [];
const jList = [];
const getItem = (list, id) => {};
```

Event handlers should start with `on` and ends with `Handler`. Also give a meaningful middle name.

```javascript
<Button onClick={onLoginHandler} />
```

Avoid using this approach in components, use Component composition as much as possible.

```javascript
const MyComponent = () => {
  const getMyComponentBody = bodyText => <h2>{bodyText}</h2>;

  return <div>{getMyComponentBody('Hello')}</div>;
};
```

Avoid Hard-Coded Strings and Magic Numbers. Move them to constants and if you see that this constant using more than in
one component/file, create a separate file for it and think about moving it to level above.

```javascript
Good: const MODAL_TITLE = 'This is modal title';

Bad;
const title = 'This is modal title';
```

```javascript
Good:
const LIST_LENGTH = 5;
for(let i = 0; i < LIST_LENGTH ; i++)

Bad:
for(let i = 0; i < 5 ; i++)
```

## Redux

### Action types

```javascript
export const AttachFilesActionTypes = {
  GET_ROOT_FOLDER: 'dialog.attachFile.GET_ROOT_FOLDER',
  GET_ROOT_FOLDER_SUCCESS: 'dialog.attachFile.GET_ROOT_FOLDER_SUCCESS',
  GET_ROOT_FOLDER_ERROR: 'dialog.attachFile.GET_ROOT_FOLDER_ERROR',
};
```

### Action

```javascript
export function getRootFolder(engagementId, clientId) {
  return async dispatch => {
    try {
        ...
```

### Selector

```javascript
const isLoading = state => state.dialogs.attachFilesDialog.get('isLoading');

export const uploadDialogSelectors = {
  isLoading,
};
```

### Reducer

```javascript
const periodsReducer = (state: <S> = initialState, action: <A>): <S> => {}
```
