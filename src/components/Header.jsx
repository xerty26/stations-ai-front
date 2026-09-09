import { useNavigate } from 'react-router-dom';

export default function Header({ children }) {

    let navigate = useNavigate();
    return (
        <header className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <picture className="flex items-center shrink-0">
                        <source media="(min-width: 1280px)" srcSet="/mark-512x512.png" />
                        <source media="(min-width: 1024px)" srcSet="/mark-192x192.png" />
                        <source media="(min-width: 640px)" srcSet="/mark-128x128.png" />
                        <img
                            src="/mark-64x64.png"
                            alt="GasOneClick Mark"
                            className="w-9 h-9 sm:w-10 sm:h-10 object-contain p-0 block"
                        />
                    </picture>
                    <picture className="flex items-center shrink-0 -ml-1">
                        <source media="(min-width: 1024px)" srcSet="/logo-horizontal-512x128.png" />
                        <source media="(min-width: 640px)" srcSet="/logo-horizontal-256x64.png" />
                        <img
                            src="/logo-horizontal-128x32.png"
                            alt="GasOneClick"
                            className="h-7 sm:h-8 w-auto object-contain block"
                        />
                    </picture>
                </div>
                {children && (
                    <div className="flex items-center space-x-2 gap-1.5 sm:gap-2">
                        {children}
                    </div>
                )}
            </div>
        </header>
    );
}
