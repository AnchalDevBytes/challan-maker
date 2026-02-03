import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthLayout = ({ children} : { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div>
        { children }
      </div>
    </GoogleOAuthProvider>
  )
}

export default AuthLayout;
