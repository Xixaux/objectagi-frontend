import Typography from '@mui/material/Typography';
import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import TitleReferenceLink from 'src/components/TitleReferenceLink';
import Link from '@objectagi/core/Link';

/**
 * Api Configuration Doc
 * This document provides information on how to configure the api.
 */
function ApiConfigurationDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                API Configuration
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                This guide outlines the process for setting up and utilizing API routes within the ObjectAGI React Next.js project.
            </Typography>

            <Typography
                className="mt-6 mb-2.5"
                variant="h6"
            >
                API Routes Structure <TitleReferenceLink id="api-routes-structure" />
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Our API routes are organized using Next.js's server-side API routing system, located within the `app/api` directory.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Below is an example of the API route structure:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-typescript"
            >
                {`
app/
  api/
    mock/
      users/
        route.ts
        [id]/
          route.ts
      notes/
        items/
          route.ts
          [id]/
            route.ts
        labels/
          route.ts
          [id]/
            route.ts
                `}
            </ObjectAGIHighlight>

            <Typography
                className="mt-6 mb-2.5"
                variant="h6"
            >
                Mock API and Database <TitleReferenceLink id="mock-api-database" />
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                We utilize a custom mock API utility (`mockApi`) and JSON files to emulate database connections and operations, facilitating straightforward testing and demonstration of API endpoints without requiring an actual database.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                The mock database data is stored in `mockDb.json`, and the `mockApi` utility offers methods for performing CRUD operations on this data.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Mock API endpoints are defined using OpenAPI specifications, which are available in the file <code>@mock-utils/mockOpenApiSpecs.json</code>.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                For comprehensive details on the mock API, refer to the{' '}
                <Link to="/documentation/development/api-integration/mock-api">Mock API Documentation</Link> page.
            </Typography>

            <Typography
                className="mt-6 mb-2.5"
                variant="h6"
            >
                API Route Example <TitleReferenceLink id="api-route-example" />
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                The following demonstrates how an API route is implemented:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-typescript"
            >
                {`
import mockApi from 'src/@mock-utils/mockApi';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const api = mockApi('users');
    const items = await api.findAll(queryParams);

    return new Response(JSON.stringify(items), { status: 200 });
}

export async function POST(req: Request) {
    const api = mockApi('users');
    const requestData = await req.json();
    const newItem = await api.create(requestData);

    return new Response(JSON.stringify(newItem), { status: 201 });
}
                `}
            </ObjectAGIHighlight>

            <Typography
                className="mt-6 mb-2.5"
                variant="h6"
            >
                Connecting to a Real Database <TitleReferenceLink id="real-database-connection" />
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                To integrate these API routes with a real database, replace the `mockApi` calls with actual database operations while maintaining the same structure and HTTP methods (GET, POST, PUT, DELETE).
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Ensure proper handling of errors and edge cases when connecting to an actual database.
            </Typography>
        </>
    );
}

export default ApiConfigurationDoc;