import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../Card"

describe("Card Component", () => {
  it("renders Card with all subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
    expect(screen.getByText("Test Content")).toBeInTheDocument()
    expect(screen.getByText("Test Footer")).toBeInTheDocument()
  })

  it("applies custom className to Card", () => {
    const { container } = render(
      <Card className="custom-class">
        <CardContent>Test</CardContent>
      </Card>
    )
    expect(container.firstChild).toHaveClass("custom-class")
  })

  it("renders Card with accessibility attributes", () => {
    render(
      <Card role="article">
        <CardContent>Test</CardContent>
      </Card>
    )
    expect(screen.getByRole("article")).toBeInTheDocument()
  })

  it("renders CardTitle with correct heading level", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    )
    const title = screen.getByText("Test Title")
    expect(title.tagName).toBe("H3")
  })
}) 