import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCard } from "../project-card";
import type { ProjectSummary } from "@/types/project";

jest.mock("../../actions", () => ({
  updateProjectNameAction: jest.fn(),
  deleteProjectAction: jest.fn(),
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

jest.mock("@/components/ui/dialog", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    Dialog: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-root">{children}</div>
    ),
    DialogTrigger: ({
      children,
      render,
      ...props
    }: {
      children: React.ReactNode;
      render?: React.ReactElement;
    }) => {
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
    DialogClose: ({
      children,
      render,
      ...props
    }: {
      children: React.ReactNode;
      render?: React.ReactElement;
    }) => {
      if (render) {
        return React.cloneElement(render, props, children);
      }
      return <button {...props}>{children}</button>;
    },
  };
});

const mockProject: ProjectSummary = {
  id: "p1",
  name: "Test Project",
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _count: { features: 3 },
};

describe("ProjectCard", () => {
  it("renders the project name", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders the project status", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders the feature count", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("3 features")).toBeInTheDocument();
  });

  it("renders singular feature count", () => {
    render(
      <ProjectCard project={{ ...mockProject, _count: { features: 1 } }} />
    );
    expect(screen.getByText("1 feature")).toBeInTheDocument();
  });

  it("has an edit button", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByRole("button", { name: /edit project name/i })
    ).toBeInTheDocument();
  });

  it("has a delete button", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByRole("button", { name: /delete project/i })
    ).toBeInTheDocument();
  });

  it("shows input with project name when edit is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={mockProject} />);

    await user.click(
      screen.getByRole("button", { name: /edit project name/i })
    );

    expect(screen.getByDisplayValue("Test Project")).toBeInTheDocument();
  });
});
