import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthServerNotice from "@/components/auth-server-notice";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="relative min-h-screen">
        <AuthServerNotice />
        {children}
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthLayout;
