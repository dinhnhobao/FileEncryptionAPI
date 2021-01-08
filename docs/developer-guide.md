# Developer Guide

## 📝 File Structure

`docs/` - for documentation

`file/` - the folder to store the file received from Power Automate. **This folder must be created upon development/deployment so that the API endpoints can work correctly.**

```
src/
  main/ # code folder
    index.js # main server entrypoint
    utils.js # utils functions
    ...
  test/ # storing tests
    index.test.js # integration tests
    utils.test.js # unit tests
    ...
```
Tests can be run using `npm run test`.

Other important NodeJS-related files such as `package.json` for dependency management, `nodemon.json` for live server reloading configuration, and `config.js`.

## Technical Implementation
To understand how the code works, please go through the [Technical Sharing Session slides](./technical-sharing-session.pptx). Please watch the slides in animation for the best experience.