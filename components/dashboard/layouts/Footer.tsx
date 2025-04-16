const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4">
      <div className="text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
