import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import LoginForm from "./LoginForm";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock AuthContext hook
jest.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    signIn: jest.fn(),
  }),
}));

// Mock signin service
jest.mock("@/lib/services/login", () => ({
  signin: jest.fn(),
}));

describe("LoginForm accessibility", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(
      <LoginForm onForgotPassword={() => {}} onSwitchToCreate={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
