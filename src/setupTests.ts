import "mutationobserver-shim";
import "@testing-library/jest-dom";

jest.mock("./configuration", () => {
  return {
    BASE_API: "http://francken.nl.localhost/api/plus-one",
    ENVIRONMENT: "testing",
  };
});
