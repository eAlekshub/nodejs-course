# nodejs-course

## Running Tests

Jest is used as a testing framework to run unit tests of the application. To run tests and generate coverage reports, follow these instructions:

1. **Prerequisites:** Ensure that you have Node.js and npm (Node Package Manager) installed on your system.
2. **Install Dependencies:** If you haven't already, install the project's dependencies by running the following command in your project directory:

   ```powershell
   npm install
   ```

3. **Run Tests:** To execute the tests and generate coverage reports, use the following command:
   ```powershell
   npm run test:unit
   ```
4. **Interpreting Results:** Jest will display the test results in your terminal. A summary of passed and failed tests will be shown at the end of the terminal output. The results of the tests and code coverage information can also be found in the `coverage` directory. Open the `index.html` file within `tests/coverage/lcov-report` in your web browser to visualize code coverage details and test results.

5. **Troubleshooting** If you encounter any problems during testing, refer to the error messages in the terminal or review the testing report for more information.

By completing these steps, you can run unit tests, evaluate code coverage, and ensure the reliability of the project.
