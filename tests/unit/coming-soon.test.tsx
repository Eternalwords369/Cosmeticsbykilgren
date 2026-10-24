import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComingSoon } from "@/components/layout/coming-soon";
import { sv } from "@/lib/copy/sv";

describe("ComingSoon", () => {
  it("renders the section title and a link home", () => {
    render(<ComingSoon title={sv.nav.shop} />);
    expect(screen.getByText(sv.nav.shop)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(sv.comingSoon.title);
    expect(screen.getByRole("link", { name: sv.comingSoon.back })).toHaveAttribute("href", "/");
  });
});
