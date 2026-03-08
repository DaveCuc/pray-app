import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        baseTheme: dark, // Tema oscuro por defecto
        variables: {
          // Reemplaza los hex con el tono exacto de tu variable --primary
          colorPrimary: '#F5A524', 
          colorBackground: '#0a0a0a', 
          colorText: '#f3f4f6',
          colorInputBackground: '#171717',
        },
        elements: {
          // Inyectamos tus clases de Tailwind directamente a los elementos de Clerk
          card: "bg-card border border-border shadow-[0_0_40px_rgba(245,165,36,0.1)] rounded-3xl",
          headerTitle: "text-foreground font-bold",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "border-border hover:bg-muted text-foreground transition-all",
          formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold shadow-lg",
          footerActionLink: "text-primary hover:text-primary/80 font-semibold",
          formFieldInput: "bg-background border-border text-foreground focus:border-primary focus:ring-primary/20",
          formFieldLabel: "text-muted-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
        }
      }}
    />
  );
}