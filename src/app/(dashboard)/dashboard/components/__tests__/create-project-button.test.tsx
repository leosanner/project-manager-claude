import { render, screen } from "@testing-library/react";
import { CreateProjectButton } from "../create-project-button";

jest.mock("../../actions", () => ({
  createProjectAction: jest.fn(),
}));

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: jest.fn((action, initialState) => {
      return [initialState, action, false];
    }),
  };
});

// Mock the Dialog to render inline (Base UI Dialog uses portals which don't work in jsdom)
jest.mock("@/components/ui/dialog", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    Dialog: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-root">{children}</div>
    ),
    DialogTrigger: ({ children, render, ...props }: { children: React.ReactNode; render?: React.ReactElement }) => {
      if (render) {
        return React.cloneElement(render, props, children);
      }
      return <button {...props}>{children}</button>;
    },
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    DialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe("CreateProjectButton", () => {
  it("renders the New Project button", () => {
    render(<CreateProjectButton />);
    expect(
      screen.getByRole("button", { name: /new project/i })
    ).toBeInTheDocument();
  });

  it("shows a name input in the dialog", () => {
    render(<CreateProjectButton />);
    expect(screen.getByPlaceholderText(/project name/i)).toBeInTheDocument();
  });

  it("shows a create submit button", () => {
    render(<CreateProjectButton />);
    expect(
      screen.getByRole("button", { name: /^create$/i })
    ).toBeInTheDocument();
  });

  it("shows error message when action returns an error", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    (React.useActionState as jest.Mock).mockReturnValue([
      { success: false, error: "Project name is required" },
      jest.fn(),
      false,
    ]);

    render(<CreateProjectButton />);
    expect(screen.getByText("Project name is required")).toBeInTheDocument();
  });
});
