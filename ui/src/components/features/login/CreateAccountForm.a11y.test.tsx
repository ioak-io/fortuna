import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import CreateAccountForm from "./CreateAccountForm";

describe("CreateAccountForm accessibility", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(
      <CreateAccountForm onSwitchToLogin={() => {}} onSubmit={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
