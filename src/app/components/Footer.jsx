import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo_2.png" alt="Mahamma logo" className="h-10 w-10 rounded-lg object-contain" />
              <div>
                <h3 className="text-lg font-bold">Mahamma</h3>
                <p className="text-sm text-gray-400">مهمّة</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              KFUPM's trusted student freelance platform
            </p>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  to="/client/post-task"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Post a Task
                </Link>
              </li>
              <li>
                <Link
                  to="/client/dashboard"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/provider/tasks"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Find Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/provider/create-service"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Create Service
                </Link>
              </li>
              <li>
                <Link
                  to="/provider/dashboard"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#F7931E] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 Mahamma. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F7931E] transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F7931E] transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F7931E] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F7931E] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
