import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Verify Email - BuzzMarket',
};

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We've sent you a sign-in link. Please check your email and click the link to sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

