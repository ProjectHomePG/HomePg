import { redirect } from 'next/navigation';
import { AUTH_ENABLED } from '../../config';

export default function LoginLayout({ children }) {
  if (!AUTH_ENABLED) {
    redirect('/');
  }
  return children;
}
