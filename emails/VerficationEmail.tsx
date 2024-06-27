import { Html, Button, Head, Preview } from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification</title>
        {username}-Your verification code is here {verifyCode};
        <Button style={{ color: "#61dafb" }}>Click me</Button>
      </Head>
    </Html>
  );
}
