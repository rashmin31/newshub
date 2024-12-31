// src/pages/ErrorPage/ErrorPage.tsx
import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from "react-router-dom";
import Button from "../../components/common/Button";

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let title = "Oops!";
    let errorMessage = "An unexpected error has occurred.";
    let details = "";

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                title = "Not Found";
                errorMessage =
                    error.statusText ||
                    `The page you're looking for doesn't exist.`;
                break;
            case 400:
                title = "Invalid Request";
                errorMessage = error.statusText || "The request was invalid.";
                break;
            case 500:
                title = "Server Error";
                errorMessage =
                    error.statusText || "There was a problem on our end.";
                break;
            default:
                errorMessage = error.statusText;
        }
        details = error.data?.message || "";
    } else if (error instanceof Error) {
        errorMessage = error.message;
        details = error.stack || "";
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full mx-auto text-center space-y-8 px-4">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {errorMessage}
                    </p>
                    {details && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            {details}
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-4">
                    <Button
                        onClick={() => navigate("/")}
                        variant="primary"
                        size="lg"
                        className="w-full"
                    >
                        Go back home
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        Go back to previous page
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
