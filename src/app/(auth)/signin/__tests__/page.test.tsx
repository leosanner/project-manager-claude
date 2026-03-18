import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInPage from "../page";

// Mock the auth client
jest.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    signIn: {
      social: jest.fn(),
    },
  },
}));

// Import the mock after jest.mock so we can access it in tests
import { authClient } from "@/lib/auth/auth-client";
const mockSignInSocial = authClient.signIn.social as jest.Mock;

describe("SignInPage", () => {
  beforeEach(() => {
    mockSignInSocial.mockClear();
  });

  it("renders the sign-in page", () => {
    render(<SignInPage />);
    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("renders a sign in with Google button", () => {
    render(<SignInPage />);
    expect(
      screen.getByRole("button", { name: /sign in with google/i })
    ).toBeInTheDocument();
  });

  it("calls signIn.social with google provider when button is clicked", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    const button = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    await user.click(button);

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });

  it("shows app name or branding", () => {
    render(<SignInPage />);
    expect(screen.getByText(/project manager/i)).toBeInTheDocument();
  });
});
