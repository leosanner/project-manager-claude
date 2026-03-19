import { render, screen } from "@testing-library/react";

jest.mock("@/lib/auth/session", () => ({
  getSessionOrThrow: jest.fn().mockResolvedValue({
    user: { id: "user-1", name: "Test User" },
    session: { id: "session-1" },
  }),
}));

jest.mock("@/lib/db/projects", () => ({
  getUserProjects: jest.fn(),
}));

jest.mock("../components/create-project-button", () => ({
  CreateProjectButton: () => <button>New Project</button>,
}));

jest.mock("../components/project-card", () => ({
  ProjectCard: ({ project }: { project: { name: string } }) => (
    <div data-testid="project-card">{project.name}</div>
  ),
}));

import { getUserProjects } from "@/lib/db/projects";
import DashboardPage from "../page";

const mockGetUserProjects = getUserProjects as jest.Mock;

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the heading", async () => {
    mockGetUserProjects.mockResolvedValue([]);
    const page = await DashboardPage();
    render(page);
    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
  });

  it("renders the New Project button", async () => {
    mockGetUserProjects.mockResolvedValue([]);
    const page = await DashboardPage();
    render(page);
    const buttons = screen.getAllByRole("button", { name: /new project/i });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders empty state when no projects", async () => {
    mockGetUserProjects.mockResolvedValue([]);
    const page = await DashboardPage();
    render(page);
    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  });

  it("renders project cards when projects exist", async () => {
    mockGetUserProjects.mockResolvedValue([
      {
        id: "p1",
        name: "Project Alpha",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { features: 2 },
      },
      {
        id: "p2",
        name: "Project Beta",
        status: "COMPLETED",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { features: 0 },
      },
    ]);
    const page = await DashboardPage();
    render(page);
    expect(screen.getAllByTestId("project-card")).toHaveLength(2);
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
  });
});
