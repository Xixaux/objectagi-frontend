'use client';

import Typography from '@mui/material/Typography';
import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import Link from '@objectagi/core/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ObjectAGINavigation from '@objectagi/core/ObjectAGINavigation/ObjectAGINavigation';
import authProtectedNavigationExamples from './authProtectedNavigationExamples';
import authProtectedNavigationExamplesRaw from './authProtectedNavigationExamples.ts?raw';

/**
 * Authorization Documentation
 * This guide explains the authorization system in ObjectAGI React.
 */
function AuthorizationDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                Authorization in ObjectAGI React
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React employs a comprehensive authorization system powered by Auth.js (formerly NextAuth.js), enhanced with custom extensions to manage user roles and permissions. This system is primarily handled through the <code>authJs.ts</code> file and the <code>useUser</code> hook.
            </Typography>

            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Implementing Authorization
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                To apply authorization in your components:
            </Typography>

            <ol className="list-decimal list-inside mb-4">
                <li>
                    Utilize the <code>useUser</code> hook to retrieve user data and roles
                </li>
                <li>Verify user roles to control access to specific features or components</li>
                <li>
                    Leverage the <code>isGuest</code> flag to distinguish between authenticated and unauthenticated users
                </li>
            </ol>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="font-semibold text-base">Authorization Role (auth) options</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <code>null</code>
                        </TableCell>
                        <TableCell>Permit access to all users without restriction</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <code>[]</code>
                        </TableCell>
                        <TableCell>Restrict access to guests only</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <code>[admin,user]</code>
                        </TableCell>
                        <TableCell>Allow access only to users with 'admin' or 'user' roles</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Typography
                className="mb-4"
                component="p"
            >
                Sample implementation in a component:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-tsx mb-6"
            >
                {`
import useUser from '@auth/useUser';

function ProtectedComponent() {
  const { data: user, isGuest } = useUser();

  if (isGuest) {
    return <p>Please sign in to access this content.</p>;
  }

  if (!user.role.includes('admin')) {
    return <p>You don't have permission to view this content.</p>;
  }

  return <p>Welcome, Admin! Here's your protected content.</p>;
}
                `}
            </ObjectAGIHighlight>

            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Route-level Authorization with AuthGuardRedirect
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React offers an <code>AuthGuardRedirect</code> component to enforce route-level authorization. This component can be integrated into layout files to limit access to entire sections of your application based on user roles.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Below is a simple example of using <code>AuthGuardRedirect</code>:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-tsx mb-6"
            >
                {`
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

function Layout({ children }) {
    return (
        <AuthGuardRedirect auth={['admin']}>
            {children}
        </AuthGuardRedirect>
    );
}
                `}
            </ObjectAGIHighlight>

            <Typography
                className="mb-4"
                component="p"
            >
                In this example, only users with the 'admin' role can access routes protected by this layout. Users lacking the required role will be redirected to a default destination, such as the login page or an "access denied" page.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                For detailed guidance on implementing <code>AuthGuardRedirect</code> in your routing setup, consult the{' '}
                <Link to="/documentation/configuration/routing">Routing Documentation</Link>.
            </Typography>

            <Typography
                variant="h6"
                className="mt-8 mb-2 font-bold"
            >
                Navigation Item Configuration:
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                You can manage the visibility of navigation <b>items, groups, or collapsible sections</b> by adding an <b>auth</b> property in <code>src/configs/NavigationConfig.tsx</code>.
            </Typography>

            <Typography
                className="mt-8 mb-2"
                variant="subtitle2"
            >
                Example Usage:
            </Typography>

            <div className="flex lg:grid-cols-2 gap-3">
                <div className="flex flex-1">
                    <ObjectAGINavigation navigation={authProtectedNavigationExamples} />
                </div>
                <div className="flex flex-1 ">
                    <ObjectAGIHighlight
                        component="pre"
                        className="language-js mb-8 max-h-sm overflow-y-auto"
                    >
                        {authProtectedNavigationExamplesRaw}
                    </ObjectAGIHighlight>
                </div>
            </div>

            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Best Practices
            </Typography>

            <ul className="list-disc list-inside mb-4">
                <li>
                    Consistently use the <code>useUser</code> hook to retrieve user data and conduct authorization checks
                </li>
                <li>
                    Apply role-based access control by validating user roles before rendering sensitive components or executing protected actions
                </li>
                <li>
                    Employ the <code>isGuest</code> flag to differentiate between authenticated and unauthenticated users
                </li>
                <li>Combine client-side checks with server-side validation to ensure robust security</li>
                <li>
                    Utilize <code>AuthGuardRedirect</code> for route-level protection to block unauthorized access to entire application sections
                </li>
                <li>
                    Maintain centralized and reusable authorization logic to ensure consistency across your application
                </li>
            </ul>

            <Typography
                className="mt-8 mb-4"
                component="p"
            >
                By utilizing the tailored Auth.js configuration and the <code>useUser</code> hook, ObjectAGI React delivers a versatile and robust authorization system that seamlessly integrates into your application’s components and logic. Always pair client-side authorization checks with server-side validation to safeguard your application’s security.
            </Typography>
        </>
    );
}

export default AuthorizationDoc;