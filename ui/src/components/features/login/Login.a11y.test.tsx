import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Login from "./Login";

// Mock the useLoginView hook
jest.mock("@/hooks/useLoginView", () => ({
  useLoginView: jest.fn((initialView) => ({
    currentView: initialView,
    showLogin: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
  })),
}));

// Mock child components to prevent their internal complexities from affecting Login component's a11y test
jest.mock("./LoginForm", () => {
  const MockLoginForm = ({ onForgotPassword, onSwitchToCreate }: any) => (
    <div data-testid="login-form">
      <button onClick={onForgotPassword}>Forgot Password</button>
      <button onClick={onSwitchToCreate}>Create Account</button>
      <input type="text" aria-label="Username" />
      <input type="password" aria-label="Password" />
      <button type="submit">Sign In</button>
    </div>
  );
  MockLoginForm.displayName = "LoginForm";
  return MockLoginForm;
});

jest.mock("./CreateAccountForm", () => {
  const MockCreateAccountForm = ({ onSwitchToLogin, onSubmit }: any) => (
    <div data-testid="create-account-form">
      <button onClick={onSwitchToLogin}>Back to Login</button>
      <button onClick={onSubmit}>Create Account</button>
      <input type="text" aria-label="Username" />
      <input type="password" aria-label="Password" />
      <input type="password" aria-label="Confirm Password" />
    </div>
  );
  MockCreateAccountForm.displayName = "CreateAccountForm";
  return MockCreateAccountForm;
});

jest.mock("./ForgotPasswordForm", () => {
  const MockForgotPasswordForm = ({ onBackToLogin, onSubmit }: any) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBackToLogin}>Back to Login</button>
      <button onClick={onSubmit}>Submit</button>
      <input type="text" aria-label="Username" />
    </div>
  );
  MockForgotPasswordForm.displayName = "ForgotPasswordForm";
  return MockForgotPasswordForm;
});

describe("Login component accessibility", () => {
  it("should not have any accessibility violations when showing login form", async () => {
    // Cast useLoginView to MockedFunction to set return value
    (require("@/hooks/useLoginView").useLoginView as jest.Mock).mockReturnValue({
      currentView: "login",
      showLogin: jest.fn(),
      showCreateAccount: jest.fn(),
      showForgotPassword: jest.fn(),
    });
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should not have any accessibility violations when showing create account form", async () => {
    (require("@/hooks/useLoginView").useLoginView as jest.Mock).mockReturnValue({
      currentView: "create_account",
      showLogin: jest.fn(),
      showCreateAccount: jest.fn(),
      showForgotPassword: jest.fn(),
    });
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should not have any accessibility violations when showing forgot password form", async () => {
    (require("@/hooks/useLoginView").useLoginView as jest.Mock).mockReturnValue({
      currentView: "forgot_password",
      showLogin: jest.fn(),
      showCreateAccount: jest.fn(),
      showForgotPassword: jest.fn(),
    });
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
