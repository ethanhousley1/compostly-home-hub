import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({}),
}));

const mockUseAuth = vi.mocked((await import("@/context/AuthContext")).useAuth);

function renderNavbar(isLoggedIn: boolean) {
  mockUseAuth.mockReturnValue({
    isLoggedIn,
    user: isLoggedIn ? { id: 1, first_name: "Test", last_name: "User", email: "test@test.com", address: null, pickup_or_dropoff: null } : null,
    login: vi.fn(),
    setAuthenticatedUser: vi.fn(),
    logout: vi.fn(),
  } as never);

  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("shows Sign Up button and separator when logged out", () => {
    renderNavbar(false);
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("hides Sign Up button and separator when logged in", () => {
    renderNavbar(true);
    expect(screen.queryByRole("link", { name: /sign up/i })).not.toBeInTheDocument();
    expect(screen.queryByText("|")).not.toBeInTheDocument();
  });
});
