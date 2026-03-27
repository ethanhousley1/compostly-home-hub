import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

import { useAuth } from "@/context/AuthContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

function renderNavbar(isLoggedIn: boolean) {
  mockUseAuth.mockReturnValue({
    isLoggedIn,
    user: isLoggedIn ? { id: 1, first_name: "Test", last_name: "User", email: "test@test.com", street_address: null, city: null, state: null, zip_code: null, pickup_or_dropoff: null, email_notifications: true, weekly_reminders: true } : null,
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
