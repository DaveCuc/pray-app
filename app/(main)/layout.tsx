import NavBar from '../_components/Navbar';
import BottomNav from '../_components/BottomNav';
import LeftNav from '../_components/LeftNav';
import SwipeWrapper from '../_components/SwipeWrapper';
import Attention from '../_components/Attention';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />

      <div className="md:flex md:min-h-[calc(100vh-4rem)]">
        <div className="hidden md:block md:w-72 border-r border-border bg-muted/20">
          <LeftNav />
        </div>

        <main className="flex-1 min-w-0 pb-24 md:pb-0">
            <Attention />
          <SwipeWrapper>{children}</SwipeWrapper>
        </main>
      </div>

      <BottomNav />
    </>
  );
}
