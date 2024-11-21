function Footer() {
  return (
    <footer className="backdrop-blur-lg bg-white/10 border-t border-white/10 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">FlowAI</h3>
            <p className="text-sm text-white/60 max-w-xs">
              Transform your ideas into beautiful flowcharts with the power of AI
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="Documentation" />
              <FooterLink href="#" text="Examples" />
              <FooterLink href="#" text="API Reference" />
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="Contact" />
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} FlowAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({ href, text }) => (
  <li>
    <a 
      href={href} 
      className="text-sm text-white/60 hover:text-white transition duration-300"
    >
      {text}
    </a>
  </li>
);

export default Footer; 