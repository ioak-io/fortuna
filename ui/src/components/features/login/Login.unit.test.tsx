import React, { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { useLoginView } from "@/hooks/useLoginView";
import { fireEvent } from "@testing-library/react";

// Mock the useLoginView hook
jest.mock("@/hooks/useLoginView", () => ({
  useLoginView: jest.fn(),
}));

// Mock child components to prevent their internal complexities from affecting Login component's unit tests
jest.mock("./LoginForm", () => {
  const MockLoginForm = ({ onForgotPassword, onSwitchToCreate }: any) => (
    <div data-testid="login-form">
      <button onClick={onForgotPassword}>Forgot Password Link</button>
      <button onClick={onSwitchToCreate}>Create Account Link</button>
      LoginForm Content
    </div>
  );
  MockLoginForm.displayName = "LoginForm";
  return MockLoginForm;
});

jest.mock("./CreateAccountForm", () => {
  const MockCreateAccountForm = ({ onSwitchToLogin, onSubmit }: any) => (
    <div data-testid="create-account-form">
      <button onClick={onSwitchToLogin}>Back to Login Link</button>
      <button onClick={onSubmit}>Create Account Button</button>
      CreateAccountForm Content
    </div>
  );
  MockCreateAccountForm.displayName = "CreateAccountForm";
  return MockCreateAccountForm;
});

jest.mock("./ForgotPasswordForm", () => {
  const MockForgotPasswordForm = ({ onBackToLogin, onSubmit }: any) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBackToLogin}>Back to Login Link</button>
      <button onClick={onSubmit}>Submit Forgot Password Button</button>
      ForgotPasswordForm Content
    </div>
  );
  MockForgotPasswordForm.displayName = "ForgotPasswordForm";
  return MockForgotPasswordForm;
});

describe("Login unit tests", () => {
  const mockShowLogin = jest.fn();
  const mockShowCreateAccount = jest.fn();
  const mockShowForgotPassword = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    (useLoginView as jest.Mock).mockReset();
    mockShowLogin.mockClear();
    mockShowCreateAccount.mockClear();
    mockShowForgotPassword.mockClear();
  });

  it("should display LoginForm when currentView is 'login'", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "login",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.queryByTestId("create-account-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("forgot-password-form")).not.toBeInTheDocument();
  });

  it("should display CreateAccountForm when currentView is 'create_account'", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "create_account",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    expect(screen.getByText(/Create a new account/i)).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("create-account-form")).toBeInTheDocument();
    expect(screen.queryByTestId("forgot-password-form")).not.toBeInTheDocument();
  });

  it("should display ForgotPasswordForm when currentView is 'forgot_password'", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "forgot_password",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    expect(screen.getByText(/Forgot your password?/i)).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-account-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
  });

  it("should call showForgotPassword when clicked from LoginForm", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "login",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Forgot Password Link/i }));
    expect(mockShowForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("should call showCreateAccount when clicked from LoginForm", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "login",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Create Account Link/i }));
    expect(mockShowCreateAccount).toHaveBeenCalledTimes(1);
  });

  it("should call showLogin when clicked from CreateAccountForm", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "create_account",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Back to Login Link/i }));
    expect(mockShowLogin).toHaveBeenCalledTimes(1);
  });

  it("should call showLogin when clicked from ForgotPasswordForm", async () => {
    (useLoginView as jest.Mock).mockReturnValue({
      currentView: "forgot_password",
      showLogin: mockShowLogin,
      showCreateAccount: mockShowCreateAccount,
      showForgotPassword: mockShowForgotPassword,
    });

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Back to Login Link/i }));
    expect(mockShowLogin).toHaveBeenCalledTimes(1);
  });
});
