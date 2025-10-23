import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ForgotPasswordForm from "./ForgotPasswordForm";

describe("ForgotPasswordForm unit tests", () => {
  it("should initialize with an empty username field", () => {
    render(<ForgotPasswordForm onBackToLogin={() => {}} onSubmit={() => {}} />);
    expect(screen.getByLabelText(/username/i)).toHaveValue("");
  });

  it("should call onSubmit when the form is submitted", () => {
    const handleSubmit = jest.fn();
    render(
      <ForgotPasswordForm onBackToLogin={() => {}} onSubmit={handleSubmit} />
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testusername" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call onBackToLogin when 'Back to Sign in' button is clicked", () => {
    const handleBackToLogin = jest.fn();
    render(
      <ForgotPasswordForm
        onBackToLogin={handleBackToLogin}
        onSubmit={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /back to sign in/i }));
    expect(handleBackToLogin).toHaveBeenCalledTimes(1);
  });
});
