import { Home, Music, User } from "lucide-react";

const NavbarMobile = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center h-16">
                <NavItem icon={Home} label="Inicio" />
                <NavItem icon={Music} label="Musica" />
                <NavItem icon={User} label="Perfil" />
            </div>
        </nav>
    );
}

const NavItem = ({ icon: Icon, label }: { icon: any; label: string }) => {
    return (
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-600 hover:text-blue-600 active:bg-blue-50 transition-colors">
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export default NavbarMobile;