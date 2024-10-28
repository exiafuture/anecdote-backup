// app/404.tsx
import Link from 'next/link';
import './notFound.css';

export default function Custom404() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn't find the page you're looking for.</p>
      <div className='shoot'>
        <Link href="/pool">
          Go to Pool
        </Link>
        <Link href="/">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
