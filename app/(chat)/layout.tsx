
export const metadata = {
  title: 'University Live Chat',
  description: 'Real-time chat support for university students and staff',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className="select-none">
        <div className="min-h-screen bg-background text-text-primary">
          {children}
        </div>
      </body>
    </html>
  );
}