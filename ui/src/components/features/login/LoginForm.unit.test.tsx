import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { signin } from "@/lib/services/login";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock AuthContext hook
jest.mock("@/lib/auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock signin service
jest.mock("@/lib/services/login", () => ({
  signin: jest.fn(),
}));

describe("LoginForm unit tests", () => {
  const mockSignIn = jest.fn();
  const mockReplace = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    (signin as jest.Mock).mockReset();
    (useAuth as jest.Mock).mockReturnValue({ signIn: mockSignIn });
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockGetSearchParams });

    // Clear mock calls for each test
    mockSignIn.mockClear();
    mockReplace.mockClear();
    mockGetSearchParams.mockClear();
  });

  it("should initialize with empty fields and rememberMe as false", () => {
    render(<LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />);

    expect(screen.getByLabelText(/username/i)).toHaveValue("");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
    expect(screen.getByLabelText(/remember me/i)).not.toBeChecked();
  });

  it("should call signin and redirect on successful submission", async () => {
    (signin as jest.Mock).mockResolvedValue({
      accessToken: "mock-access-token",
      claims: { userId: "123" },
    });
    mockGetSearchParams.mockReturnValue("/dashboard");

    render(<LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signin).toHaveBeenCalledWith({
        username: "testusername",
        password: "password123",
      });
      expect(mockSignIn).toHaveBeenCalledWith("mock-access-token", { userId: "123" });
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should display error message on 401 API error", async () => {
    (signin as jest.Mock).mockRejectedValue({ status: 401, message: "Invalid credentials" });

    render(<LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it("should display generic error message on 500 API error", async () => {
    (signin as jest.Mock).mockRejectedValue({ status: 500, message: "Internal Server Error" });

    render(<LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Server error, please try again later./i)
      ).toBeInTheDocument();
    });
  });

  it("should display unexpected error message for non-API errors", async () => {
    (signin as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Unexpected error/i)).toBeInTheDocument();
    });
  });

  it("should call onForgotPassword when 'Forgot your password?' button is clicked", () => {
    const handleForgotPassword = jest.fn();
    render(
      <LoginForm
        onForgotPassword={handleForgotPassword}
        onSwitchToCreate={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Forgot your password?/i }));
    expect(handleForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("should call onSwitchToCreate when 'Create a new account' button is clicked", () => {
    const handleSwitchToCreate = jest.fn();
    render(
      <LoginForm
        onForgotPassword={() => {}}
        onSwitchToCreate={handleSwitchToCreate}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Create a new account/i }));
    expect(handleSwitchToCreate).toHaveBeenCalledTimes(1);
  });
});
