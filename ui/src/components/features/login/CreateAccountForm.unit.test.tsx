import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateAccountForm from "./CreateAccountForm";

describe("CreateAccountForm unit tests", () => {
  it("should initialize with empty email and password fields", () => {
    render(<CreateAccountForm onSwitchToLogin={() => {}} onSubmit={() => {}} />);
    expect(screen.getByLabelText(/username/i)).toHaveValue("");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
  });

  it("should call onSubmit when the form is submitted", () => {
    const handleSubmit = jest.fn();
    render(
      <CreateAccountForm onSwitchToLogin={() => {}} onSubmit={handleSubmit} />
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newusername" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "newpass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call onSwitchToLogin when 'Already have an account? Sign in' button is clicked", () => {
    const handleSwitchToLogin = jest.fn();
    render(
      <CreateAccountForm
        onSwitchToLogin={handleSwitchToLogin}
        onSubmit={() => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /already have an account\? sign in/i })
    );
    expect(handleSwitchToLogin).toHaveBeenCalledTimes(1);
  });
});
