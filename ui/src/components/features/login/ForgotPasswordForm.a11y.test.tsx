import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import ForgotPasswordForm from "./ForgotPasswordForm";

describe("ForgotPasswordForm accessibility", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(
      <ForgotPasswordForm onBackToLogin={() => {}} onSubmit={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
