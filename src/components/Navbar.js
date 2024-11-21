import { motion } from 'framer-motion';

function Navbar() {
  return (
    <nav className="sticky top-0 backdrop-blur-lg bg-white/10 border-b border-white/10 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <span className="text-xl font-bold">FlowAI</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <NavLink href="#" text="Home" />
            <NavLink href="#" text="Examples" />
            <NavLink href="#" text="GitHub" />
          </motion.div>
        </div>
      </div>
    </nav>
  );
}

const NavLink = ({ href, text }) => (
  <a 
    href={href} 
    className="text-sm text-white/80 hover:text-white transition duration-300 relative group"
  >
    {text}
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
  </a>
);

export default Navbar; 