import type { Metadata } from 'next';
import ThemeRegistry from '@/theme/theme-registry';
import { AuthProvider } from '@/context/auth-context';
import { UI_STRINGS } from '@/constants/ui-strings';
import './globals.css';

export const metadata: Metadata = {
  title: 'Code-o-Bit | ' + UI_STRINGS.LANDING_TITLE_MAIN,
  description: UI_STRINGS.LANDING_SUBTITLE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
