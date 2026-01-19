import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent mb-4">
                            TradeSense AI
                        </h3>
                        <p className="text-gray-400 max-w-sm">
                            La plateforme de prop trading n°1 au Maroc. Testez vos compétences, gérez nos capitaux.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Liens Rapides</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-white transition-colors">Classement</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Termes & Conditions</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 mt-12 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} TradeSense AI. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
