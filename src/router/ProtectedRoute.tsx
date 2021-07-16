import { useSession } from 'next-auth/client';

export default function ProtectedRoute({ router, children }) {
  const [session, loading] = useSession();

  let unprotectedRoutes = ['/', '/boards/[slug]'];
  let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;
  if (loading) return null;
  console.log(router.pathname);

  if (typeof window !== 'undefined' && !session && pathIsProtected) {
    router.push('/');
  } else {
    if (session && router.pathname === '/') {
      router.push('/boards');
    }
    return children;
  }
  return null;
}
