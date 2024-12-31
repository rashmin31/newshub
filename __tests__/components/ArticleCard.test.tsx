import { render, screen, fireEvent } from "@testing-library/react";
import ArticleCard from "../../src/components/ArticlesSection/ArticleCard";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockArticle = {
    articleId: "1",
    title: "Test Article",
    description: "Test Description",
    content: "Test Content",
    publishedAt: "2024-01-01T00:00:00Z",
    source: "Test Source",
    url: "https://test.com",
    urlToImage: "https://test.com/image.jpg",
    category: "Test Category",
    author: "Test Author",
};

describe("ArticleCard Component", () => {
    it("navigates to article detail page when clicked", () => {
        render(<ArticleCard article={mockArticle} />);

        const article = screen.getByRole("article");
        fireEvent.click(article);

        expect(mockNavigate).toHaveBeenCalledWith(
            `/article/${encodeURIComponent(mockArticle.articleId)}`
        );
    });
});
